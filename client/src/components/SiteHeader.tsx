import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [pathname] = useLocation();

  const link = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={`text-sm font-medium transition-colors hover:text-foreground ${
        pathname === href ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground text-background text-[11px] font-bold tracking-tight">
            N°1
          </div>
          <span className="text-base font-semibold tracking-tight">
            인터넷 비교센터
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {link("/sk", "SK")}
          {link("/lg", "LG")}
          {link("/admin", "관리자")}
        </nav>

        <div className="hidden md:flex">
          <Button asChild size="sm" className="rounded-full px-5">
            <a href="#apply">상담 신청</a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label="메뉴"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {link("/sk", "SK")}
            {link("/lg", "LG")}
            {link("/admin", "관리자")}
            <Button asChild size="sm" className="mt-1 w-full rounded-full">
              <a href="#apply" onClick={() => setOpen(false)}>
                상담 신청
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
