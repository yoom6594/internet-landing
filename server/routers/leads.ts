import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";
import {
  createLead,
  findRecentLead,
  getLeadStats,
  listLeads,
  updateLeadStatus,
} from "../db";

const phoneRegex = /^010-?\d{3,4}-?\d{4}$/;

const createSchema = z.object({
  carrier: z.enum(["SK", "LG"]),
  name: z.string().trim().min(2, "이름은 2자 이상 입력해 주세요").max(40),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "연락처는 010-0000-0000 형식으로 입력해 주세요"),
  address: z.string().trim().min(10, "주소를 10자 이상 입력해 주세요").max(200),
  plan: z.enum(["100M", "500M", "1G"] as const, {
    message: "희망 요금제는 100M / 500M / 1G 중에서 선택해 주세요",
  }),
  installDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "설치 희망일을 선택해 주세요"),
  agree: z.boolean().refine(v => v === true, {
    message: "개인정보 수집 및 이용에 동의해 주세요",
  }),
});

const carrierLabel = (c: "SK" | "LG") =>
  c === "SK" ? "SK브로드밴드" : "LG U+";

const normalizePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return raw;
};

export const leadsRouter = router({
  /**
   * DB 게더링 신청 생성. 누구나 호출 가능 (랜딩페이지에서 사용).
   */
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ input }) => {
      const phone = normalizePhone(input.phone);

      const existing = await findRecentLead(input.carrier, phone);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "이미 24시간 이내에 동일 연락처로 접수된 신청 건이 있습니다. 곧 상담원이 연락드릴 예정입니다.",
        });
      }

      const inserted = await createLead({
        carrier: input.carrier,
        name: input.name,
        phone,
        address: input.address,
        plan: input.plan,
        installDate: input.installDate,
      });

      // 신규 신청 접수 시 오너에게 알림 발송 (실패해도 신청은 성공)
      try {
        await notifyOwner({
          title: `[신규 인터넷 가입 신청] ${carrierLabel(input.carrier)} - ${input.name}님`,
          content: [
            `통신사: ${carrierLabel(input.carrier)}`,
            `이름: ${input.name}`,
            `연락처: ${phone}`,
            `주소: ${input.address}`,
            `희망 요금제: ${input.plan}`,
            `설치 희망일: ${input.installDate}`,
            ``,
            `관리자 페이지에서 상담을 진행해 주세요.`,
          ].join("\n"),
        });
      } catch (e) {
        console.warn("[leads.create] notifyOwner failed", e);
      }

      return { success: true, id: inserted?.id };
    }),

  /**
   * 관리자 전용: 신청 목록 조회
   */
  list: adminProcedure
    .input(
      z
        .object({
          carrier: z.enum(["SK", "LG"]).optional(),
          status: z.enum(["대기", "연락완료", "계약완료"]).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return listLeads(input ?? {});
    }),

  /**
   * 관리자 전용: 신청 상태 변경
   */
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["대기", "연락완료", "계약완료"]),
        memo: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const updated = await updateLeadStatus(input.id, input.status, input.memo);
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "신청 건을 찾을 수 없습니다" });
      }
      return updated;
    }),

  /**
   * 관리자 전용: 통계
   */
  stats: adminProcedure.query(() => getLeadStats()),
});
