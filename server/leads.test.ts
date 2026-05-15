import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

// notifyOwner는 외부 호출이므로 항상 성공으로 mock 처리
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

// DB 헬퍼 mock
const recentLeadStore: Array<{ carrier: "SK" | "LG"; phone: string; createdAt: Date }> = [];
const updatedRows: Record<number, { id: number; status: string; memo?: string }> = {
  10: { id: 10, status: "대기" },
};

vi.mock("./db", () => ({
  createLead: vi.fn(async (lead: any) => {
    recentLeadStore.push({ carrier: lead.carrier, phone: lead.phone, createdAt: new Date() });
    return { id: 1 };
  }),
  findRecentLead: vi.fn(async (carrier: "SK" | "LG", phone: string) => {
    return recentLeadStore.find(l => l.carrier === carrier && l.phone === phone);
  }),
  listLeads: vi.fn(async () => []),
  updateLeadStatus: vi.fn(async (id: number, status: any, memo?: string) => {
    if (!updatedRows[id]) return undefined;
    updatedRows[id] = { id, status, memo };
    return updatedRows[id];
  }),
  getLeadStats: vi.fn(async () => ({ total: 0, pending: 0, contacted: 0, contracted: 0, sk: 0, lg: 0 })),
}));

import { appRouter } from "./routers";
import { notifyOwner } from "./_core/notification";

const baseUser = {
  id: 1,
  openId: "owner",
  email: "a@b.com",
  name: "Owner",
  loginMethod: "manus",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
} as const;

const makeCtx = (role: "user" | "admin" | null): TrpcContext => ({
  user: role === null ? null : ({ ...baseUser, role } as any),
  req: { protocol: "https", headers: {} } as any,
  res: { clearCookie: () => {} } as any,
});

beforeEach(() => {
  recentLeadStore.length = 0;
  vi.mocked(notifyOwner).mockClear();
});

describe("leads.create", () => {
  it("유효한 입력으로 신청을 접수하고 notifyOwner 를 호출한다", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const res = await caller.leads.create({
      carrier: "SK",
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123 101동 101호",
      plan: "500M",
      installDate: "2026-06-01",
      agree: true,
    });
    expect(res.success).toBe(true);
    expect(notifyOwner).toHaveBeenCalledTimes(1);
    const args = vi.mocked(notifyOwner).mock.calls[0][0];
    expect(args.title).toContain("SK");
    expect(args.content).toContain("홍길동");
  });

  it("잘못된 연락처는 BAD_REQUEST 로 거절한다", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.leads.create({
        carrier: "LG",
        name: "김철수",
        phone: "12345",
        address: "서울시 강남구 테헤란로 123 101동 101호",
        plan: "1G",
        installDate: "2026-06-01",
        agree: true,
      }),
    ).rejects.toThrow();
  });

  it("허용되지 않은 plan(예: 2G)은 거절한다", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.leads.create({
        carrier: "SK",
        name: "테스트",
        phone: "010-2222-3333",
        address: "서울시 강남구 테헤란로 123 101동 101호",
        plan: "2G" as any,
        installDate: "2026-06-01",
        agree: true,
      }),
    ).rejects.toThrow();
  });

  it("동의하지 않으면 거절한다", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.leads.create({
        carrier: "LG",
        name: "김철수",
        phone: "010-1111-2222",
        address: "서울시 강남구 테헤란로 123 101동 101호",
        plan: "1G",
        installDate: "2026-06-01",
        agree: false,
      }),
    ).rejects.toThrow();
  });

  it("동일 통신사 + 동일 연락처 24시간 내 중복 신청은 CONFLICT 로 거절한다", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const payload = {
      carrier: "SK" as const,
      name: "홍길동",
      phone: "010-9999-8888",
      address: "서울시 강남구 테헤란로 123 101동 101호",
      plan: "500M",
      installDate: "2026-06-01",
      agree: true as const,
    };
    await caller.leads.create(payload);
    await expect(caller.leads.create(payload)).rejects.toMatchObject({
      message: expect.stringContaining("이미"),
    });
  });
});

describe("leads.updateStatus 권한", () => {
  it("비관리자는 호출할 수 없다 (FORBIDDEN)", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.leads.updateStatus({ id: 10, status: "연락완료" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("관리자는 상태를 변경할 수 있다", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.leads.updateStatus({ id: 10, status: "계약완료" });
    expect(result?.status).toBe("계약완료");
  });
});

describe("leads.list 권한", () => {
  it("비로그인 사용자는 접근할 수 없다", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.leads.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
