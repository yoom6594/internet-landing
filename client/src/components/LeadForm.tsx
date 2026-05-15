import { useMemo, useState } from "react";

type PlanValue = "100M" | "500M" | "1G";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { CarrierContent } from "@/data/carriers";

type Errors = Partial<Record<"name" | "phone" | "address" | "plan" | "installDate" | "agree", string>>;

const phoneRegex = /^010-?\d{3,4}-?\d{4}$/;

const formatPhone = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export function LeadForm({ carrier }: { carrier: CarrierContent }) {
  const minDate = useMemo(() => todayPlus(1), []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [plan, setPlan] = useState<PlanValue>(
    (carrier.plans.find(p => p.highlight)?.speed ?? carrier.plans[0].speed) as PlanValue,
  );
  const [installDate, setInstallDate] = useState(todayPlus(2));
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const createMutation = trpc.leads.create.useMutation();

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "이름은 2자 이상 입력해 주세요";
    if (!phoneRegex.test(phone.trim())) e.phone = "010-0000-0000 형식으로 입력해 주세요";
    if (address.trim().length < 10) e.address = "주소를 10자 이상 정확히 입력해 주세요";
    if (!plan) e.plan = "희망 요금제를 선택해 주세요";
    if (!installDate) e.installDate = "설치 희망일을 선택해 주세요";
    if (!agree) e.agree = "개인정보 수집 및 이용에 동의해 주세요";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("입력 정보를 다시 확인해 주세요");
      return;
    }
    try {
      await createMutation.mutateAsync({
        carrier: carrier.key,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        plan,
        installDate,
        agree: true,
      });
      setSubmitted(true);
      toast.success("신청이 정상적으로 접수되었습니다");
    } catch (err: any) {
      toast.error(err?.message ?? "신청 중 오류가 발생했습니다");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-bold tracking-tight">신청이 접수되었습니다</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {carrier.brand} 전담 상담사가 영업일 기준 1시간 이내 입력하신
          연락처로 안내 전화를 드립니다.
        </p>
        <div className="mt-6 grid gap-2 rounded-lg bg-muted p-4 text-left text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">통신사</span><span className="font-medium">{carrier.brand}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">희망 요금제</span><span className="font-medium">{plan}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">설치 희망일</span><span className="font-medium">{installDate}</span></div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)] sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {carrier.brand} 가입 상담
          </div>
          <h3 className="mt-1 text-2xl font-bold tracking-tight">
            1분이면 끝나는 신청
          </h3>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" /> 안심 상담
        </div>
      </div>

      <div className="grid gap-4">
        <Field label="이름" error={errors.name}>
          <Input
            placeholder="홍길동"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
          />
        </Field>

        <Field label="연락처" error={errors.phone} hint="입력하신 번호로 상담사가 연락드립니다">
          <Input
            placeholder="010-0000-0000"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            inputMode="numeric"
            autoComplete="tel"
          />
        </Field>

        <Field label="설치 주소" error={errors.address} hint="동/호수까지 정확히 입력해 주세요">
          <Input
            placeholder="서울시 강남구 테헤란로 ○○길 ○○ 아파트 101동 1001호"
            value={address}
            onChange={e => setAddress(e.target.value)}
            autoComplete="street-address"
          />
        </Field>

        <Field label="희망 요금제" error={errors.plan}>
          <div className="grid grid-cols-3 gap-2">
            {carrier.plans.map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPlan(p.speed as PlanValue)}
                className={`rounded-lg border px-3 py-3 text-center transition-all ${
                  plan === p.speed
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card hover:border-foreground/40"
                }`}
              >
                <div className="text-xs opacity-70">{p.name}</div>
                <div className="text-base font-bold">{p.speed}</div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="설치 희망일" error={errors.installDate}>
          <Input
            type="date"
            value={installDate}
            min={minDate}
            onChange={e => setInstallDate(e.target.value)}
          />
        </Field>

        <label className="mt-2 flex items-start gap-2 text-sm">
          <Checkbox
            checked={agree}
            onCheckedChange={v => setAgree(Boolean(v))}
            className="mt-0.5"
          />
          <span className="leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">[필수]</span> 본인은
            가입 상담 목적의 개인정보(이름·연락처·주소) 수집 및 이용에 동의합니다.
            상담 외 목적으로 사용되지 않습니다.
          </span>
        </label>
        {errors.agree && (
          <div className="text-xs font-medium text-destructive">{errors.agree}</div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={createMutation.isPending}
          className="mt-2 h-12 w-full rounded-xl text-base font-bold"
        >
          {createMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 접수 중...
            </>
          ) : (
            "무료 상담 신청하기"
          )}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          신청 즉시 사은품·할인 조건을 정확하게 안내해 드립니다.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium">{label}</Label>
      {children}
      {hint && !error && (
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      )}
      {error && (
        <div className="mt-1 text-xs font-medium text-destructive">{error}</div>
      )}
    </div>
  );
}
