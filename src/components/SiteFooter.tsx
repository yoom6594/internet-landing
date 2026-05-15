export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground text-[11px] font-bold">
              N°1
            </div>
            <span className="text-base font-semibold">인터넷 비교센터</span>
          </div>
          <p className="mt-3 text-sm text-background/60 leading-relaxed">
            SK·LG 인터넷 가입을 가장 명확한 조건으로 비교하고
            <br />
            안전하게 신청할 수 있도록 돕습니다.
          </p>
        </div>
        <div className="text-sm text-background/70 leading-7">
          <div className="text-background font-semibold mb-2">상담 안내</div>
          평일 09:00 - 21:00 / 주말·공휴일 10:00 - 18:00
          <br />
          상담은 무료이며, 동의 없이 가입이 진행되지 않습니다.
        </div>
        <div className="text-xs text-background/50 leading-6">
          본 사이트는 SK브로드밴드, LG U+ 공식 제휴 채널의 가입 상담을
          중개하는 비교 안내 페이지이며, 실제 가입은 상담 후 본인 동의 하에
          공식 절차로 진행됩니다. 입력하신 개인정보는 가입 상담 목적 이외에
          사용되지 않으며, 관련 법령에 따라 안전하게 관리됩니다.
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="container py-4 text-xs text-background/50">
          © {new Date().getFullYear()} 인터넷 비교센터. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
