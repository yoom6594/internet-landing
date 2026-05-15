import { ArrowDown, ArrowRight, Check, Phone, ShieldCheck, Sparkles, Wifi, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LeadForm } from "@/components/LeadForm";
import { useReveal } from "@/hooks/useReveal";
import type { CarrierContent } from "@/data/carriers";

export function CarrierPage({ carrier }: { carrier: CarrierContent }) {
  useReveal();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container relative grid gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-28">
          <div className="reveal flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-background/30 px-3 py-1 text-[11px] font-medium uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> {carrier.heroEyebrow}
            </div>
            <h1 className="display-tight mt-5 whitespace-pre-line text-4xl font-black md:text-6xl lg:text-7xl">
              {carrier.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-base text-background/70 md:text-lg leading-relaxed">
              {carrier.heroSubtitle}
            </p>

            <ul className="mt-8 grid gap-3">
              {carrier.heroPoints.map(pt => (
                <li key={pt} className="flex items-center gap-2 text-sm md:text-base">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-background px-7 text-base font-bold text-foreground hover:bg-background/90"
              >
                <a href="#apply">
                  지금 신청하기 <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <a
                href="#plans"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-background/80 underline-offset-4 hover:underline"
              >
                요금제 비교 보기 <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* HERO 카드: 핵심 혜택 요약 */}
          <div className="reveal flex items-center">
            <div className="w-full rounded-3xl border border-background/15 bg-background/5 p-6 backdrop-blur md:p-8">
              <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-background/60">
                <Wifi className="h-4 w-4" /> {carrier.brand}
              </div>
              <div className="mt-3 text-3xl font-black md:text-4xl">
                {carrier.tagline}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {carrier.benefits.slice(0, 4).map((b, i) => (
                  <div key={i} className="rounded-xl bg-background/10 p-4">
                    <div className="text-[11px] uppercase tracking-widest text-background/60">
                      Benefit {i + 1}
                    </div>
                    <div className="mt-1.5 text-base font-bold leading-tight">
                      {b.title}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-background py-3 px-4 text-foreground">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-medium">
                  평일 09:00 - 21:00 · 즉시 콜백 상담
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-b border-border bg-secondary">
        <div className="container grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { v: "65만원", l: "최대 현금 사은품" },
            { v: "100%", l: "타사 위약금 지원" },
            { v: "1시간", l: "이내 상담 콜백" },
            { v: "24~48h", l: "빠른 설치" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="num-display text-2xl font-black md:text-3xl">
                {s.v}
              </div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="container">
          <div className="reveal max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              왜 이곳에서 신청해야 하나요
            </div>
            <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
              {carrier.brand}의 모든 혜택을
              <br className="hidden md:block" />
              가장 명확한 조건으로
            </h2>
          </div>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            {carrier.benefits.map((b, i) => {
              const Icon = [Sparkles, ShieldCheck, Zap, Wifi][i] ?? Sparkles;
              return (
              <div
                key={b.title}
                className="reveal group bg-background p-7 transition-colors hover:bg-foreground hover:text-background"
              >
                <div className="num-display text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-background/60">
                  0{i + 1}
                </div>
                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-md border border-border group-hover:border-background/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-lg font-bold leading-tight">{b.title}</div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground group-hover:text-background/70">
                  {b.desc}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="border-b border-border bg-secondary py-20 md:py-28">
        <div className="container">
          <div className="reveal flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                요금제 비교
              </div>
              <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
                내게 맞는 속도와 혜택
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              표시된 금액은 3년 약정 기준 월 납부 요금이며, 사은품과 결합 조건은
              상담 시 정확하게 안내됩니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {carrier.plans.map((p, i) => (
              <div
                key={p.id}
                className={`reveal group relative flex flex-col rounded-2xl border p-7 transition-all ${
                  p.highlight
                    ? "border-foreground bg-foreground text-background shadow-2xl md:-translate-y-3"
                    : "border-border bg-background hover:border-foreground/40"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-7 rounded-full bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-foreground">
                    인기 ★
                  </div>
                )}
                <div className="text-xs font-semibold uppercase tracking-widest opacity-70">
                  Plan {i + 1} · {p.name}
                </div>
                <div className="num-display mt-3 text-5xl font-black">
                  {p.speed}
                </div>
                <div className="mt-1 text-sm opacity-70">{p.contracted}</div>

                <div className="mt-7 flex items-baseline gap-1">
                  <span className="num-display text-3xl font-black">
                    {p.monthly}
                  </span>
                  <span className="text-sm opacity-70">원/월</span>
                </div>
                <div
                  className={`mt-2 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${
                    p.highlight
                      ? "bg-background text-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {p.cashback}
                </div>

                <ul className="mt-7 space-y-2.5 border-t border-current/10 pt-6 text-sm">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="opacity-90">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  className={`mt-8 h-12 w-full rounded-xl font-bold ${
                    p.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : ""
                  }`}
                >
                  <a href="#apply">{p.speed} 신청하기</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="container">
          <div className="reveal max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              신청부터 개통까지
            </div>
            <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
              4단계 프로세스
            </h2>
          </div>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-4">
            {carrier.steps.map(s => (
              <div key={s.title} className="reveal bg-background p-7">
                <div className="num-display text-3xl font-black">{s.title.split(" ")[0]}</div>
                <div className="mt-2 text-base font-bold">
                  {s.title.split(" ").slice(1).join(" ")}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY (FORM) */}
      <section id="apply" className="border-b border-border bg-secondary py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-5">
          <div className="reveal lg:col-span-2 flex flex-col justify-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              상담 신청
            </div>
            <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
              지금 신청하면
              <br />
              가장 좋은 조건
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground leading-relaxed md:text-base">
              월별 프로모션 조건은 빠르게 변동됩니다. 신청 시점의 최신 사은품과
              결합 할인을 모두 적용해 드립니다.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                "강매·과장 없는 정직한 안내",
                "원하지 않으면 가입하지 않아도 됩니다",
                "동의 없이 진행되지 않습니다",
              ].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="h-3 w-3" />
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="reveal lg:col-span-3">
            <LeadForm carrier={carrier} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border py-20 md:py-28">
        <div className="container max-w-3xl">
          <div className="reveal text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              자주 묻는 질문
            </div>
            <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
              FAQ
            </h2>
          </div>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {carrier.faqs.map((f, i) => (
              <details key={i} className="group reveal py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <div>
                    <div className="num-display text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Q{String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-base font-bold md:text-lg">{f.q}</div>
                  </div>
                  <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-base transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* MOBILE STICKY CTA */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <Button asChild size="lg" className="h-12 w-full rounded-xl font-bold">
          <a href="#apply">{carrier.brand} 무료 상담 신청</a>
        </Button>
      </div>
    </div>
  );
}
