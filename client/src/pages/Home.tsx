import { Link } from "wouter";
import { ArrowRight, BadgeCheck, Check, Phone, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useReveal } from "@/hooks/useReveal";

const stats = [
  { v: "65만원", l: "최대 현금 사은품" },
  { v: "100%", l: "타사 위약금 지원" },
  { v: "1시간", l: "이내 상담 콜백" },
  { v: "10,000+", l: "누적 가입 상담" },
];

const carriers = [
  {
    key: "SK",
    href: "/sk",
    brand: "SK브로드밴드",
    tagline: "끊김 없는 속도, 검증된 안정성",
    cash: "현금 최대 60만원",
    bullets: [
      "전국 안정적인 광랜 인프라",
      "T 결합 시 회선당 추가 할인",
      "당일·익일 빠른 설치",
    ],
  },
  {
    key: "LG",
    href: "/lg",
    brand: "LG U+",
    tagline: "기가 인터넷의 새로운 기준",
    cash: "현금 최대 65만원",
    bullets: [
      "업계 최대 수준 현금 사은품",
      "U+tv 결합 추가 상품권 혜택",
      "기가 Wi-Fi 6 무상 제공",
    ],
  },
];

export default function Home() {
  useReveal();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container relative grid gap-10 py-20 md:py-28 lg:py-32">
          <div className="reveal max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-background/30 px-3 py-1 text-[11px] font-medium uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> 인터넷 비교 · 가입 상담 센터
            </div>
            <h1 className="display-tight mt-6 text-5xl font-black md:text-7xl lg:text-8xl">
              인터넷 가입,
              <br />
              가장 명확하게.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-background/70 md:text-lg leading-relaxed">
              SK브로드밴드와 LG U+의 모든 요금제와 사은품을 한 곳에서.
              과장 없이 가장 정확한 조건으로 무료 상담을 받아보세요.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-background px-7 text-base font-bold text-foreground hover:bg-background/90"
              >
                <a href="#choose">
                  통신사 선택하기 <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <div className="inline-flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4" /> 평일 09:00 - 21:00 즉시 콜백
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border bg-secondary">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map(s => (
            <div key={s.l} className="text-center">
              <div className="num-display text-2xl font-black md:text-4xl">
                {s.v}
              </div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHOOSE CARRIER */}
      <section id="choose" className="border-b border-border py-20 md:py-28">
        <div className="container">
          <div className="reveal max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Step 1. 통신사 선택
            </div>
            <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
              어떤 통신사로
              <br />
              가입하시나요?
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
              통신사를 선택하면 해당 브랜드의 요금제·사은품·결합 혜택을
              한 페이지에서 확인하고 바로 신청할 수 있습니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {carriers.map(c => (
              <Link key={c.key} href={c.href} className="reveal group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-foreground hover:shadow-2xl md:p-10">
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background text-xl font-black tracking-tight">
                      {c.key}
                    </div>
                    <div className="rounded-full bg-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-background">
                      {c.cash}
                    </div>
                  </div>
                  <div className="mt-8">
                    <div className="text-2xl font-black md:text-3xl">
                      {c.brand}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {c.tagline}
                    </div>
                  </div>
                  <ul className="mt-8 grid gap-2.5 text-sm">
                    {c.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 inline-flex items-center gap-2 text-sm font-bold underline-offset-4 group-hover:underline">
                    {c.brand} 신청 페이지로
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>

                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -bottom-12 text-[160px] font-black tracking-tighter text-muted opacity-30 group-hover:opacity-50"
                  >
                    {c.key}
                  </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-b border-border bg-secondary py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="reveal">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              왜 이곳에서 신청해야 하나요
            </div>
            <h2 className="display-tight mt-3 text-3xl font-black md:text-5xl">
              가장 명확한 조건,
              <br />
              가장 안전한 절차.
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted-foreground md:text-base leading-relaxed">
              본 사이트는 SK·LG 공식 제휴 채널의 가입 상담을 안내하는 비교
              플랫폼입니다. 강매·과장 없이, 입력하신 정보는 가입 상담 외
              어떠한 목적에도 사용되지 않습니다.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {[
              { icon: BadgeCheck, t: "공식 제휴 채널", d: "SK·LG 공식 제휴 채널을 통한 안전한 가입 절차" },
              { icon: ShieldCheck, t: "개인정보 보호", d: "상담 외 목적 사용 금지, 관련 법령에 따라 안전 관리" },
              { icon: Wifi, t: "최저가 보장", d: "공식 채널 동일 조건 대비 가장 좋은 혜택 제공" },
              { icon: Phone, t: "1:1 전담 상담", d: "1시간 이내 전담 상담사가 직접 안내" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="reveal bg-background p-7">
                <Icon className="h-5 w-5" />
                <div className="mt-3 text-base font-bold">{t}</div>
                <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border bg-foreground py-20 text-background md:py-24">
        <div className="container reveal text-center">
          <h2 className="display-tight mx-auto max-w-2xl text-3xl font-black md:text-5xl">
            지금 신청하면 가장 좋은 조건으로 안내드립니다.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full bg-background px-7 text-base font-bold text-foreground hover:bg-background/90">
              <Link href="/sk">SK브로드밴드 신청</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-background px-7 text-base font-bold text-background hover:bg-background hover:text-foreground">
              <Link href="/lg">LG U+ 신청</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
