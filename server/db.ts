import { and, desc, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertLead, InsertUser, leads, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * 인터넷 가입 신청 관련 헬퍼.
 */
export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(leads).values(lead).$returningId();
  return result;
}

/**
 * 동일 통신사 + 동일 연락처로 최근 24시간 이내에 신청된 건이 있는지 확인한다.
 */
export async function findRecentLead(carrier: "SK" | "LG", phone: string) {
  const db = await getDb();
  if (!db) return undefined;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const result = await db
    .select()
    .from(leads)
    .where(and(eq(leads.carrier, carrier), eq(leads.phone, phone), gt(leads.createdAt, since)))
    .limit(1);
  return result[0];
}

export async function listLeads(filters: { carrier?: "SK" | "LG"; status?: "대기" | "연락완료" | "계약완료" } = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [] as any[];
  if (filters.carrier) conditions.push(eq(leads.carrier, filters.carrier));
  if (filters.status) conditions.push(eq(leads.status, filters.status));
  const query = db.select().from(leads);
  const rows = conditions.length
    ? await query.where(and(...conditions)).orderBy(desc(leads.createdAt))
    : await query.orderBy(desc(leads.createdAt));
  return rows;
}

export async function updateLeadStatus(id: number, status: "대기" | "연락완료" | "계약완료", memo?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set({ status, ...(memo !== undefined ? { memo } : {}) }).where(eq(leads.id, id));
  const [updated] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return updated;
}

export async function getLeadStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, contacted: 0, contracted: 0, sk: 0, lg: 0 };
  const rows = await db.select().from(leads);
  return {
    total: rows.length,
    pending: rows.filter(r => r.status === "대기").length,
    contacted: rows.filter(r => r.status === "연락완료").length,
    contracted: rows.filter(r => r.status === "계약완료").length,
    sk: rows.filter(r => r.carrier === "SK").length,
    lg: rows.filter(r => r.carrier === "LG").length,
  };
}
