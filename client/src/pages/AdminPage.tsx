import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Loader2, LogOut, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

type CarrierFilter = "ALL" | "SK" | "LG";
type StatusFilter = "ALL" | "대기" | "연락완료" | "계약완료";

const STATUSES = ["대기", "연락완료", "계약완료"] as const;

const statusBadge = (s: string) => {
  switch (s) {
    case "대기":
      return "bg-muted text-foreground";
    case "연락완료":
      return "bg-foreground/10 text-foreground border border-foreground/20";
    case "계약완료":
      return "bg-foreground text-background";
    default:
      return "bg-muted";
  }
};

export default function AdminPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [carrier, setCarrier] = useState<CarrierFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const isAdmin = user?.role === "admin";

  const listQuery = trpc.leads.list.useQuery(
    {
      carrier: carrier === "ALL" ? undefined : carrier,
      status: status === "ALL" ? undefined : status,
    },
    { enabled: isAdmin },
  );
  const statsQuery = trpc.leads.stats.useQuery(undefined, { enabled: isAdmin });
  const utils = trpc.useUtils();
  const updateMutation = trpc.leads.updateStatus.useMutation({
    onSuccess: () => {
      utils.leads.list.invalidate();
      utils.leads.stats.invalidate();
      toast.success("상태가 변경되었습니다");
    },
    onError: e => toast.error(e.message),
  });

  const stats = statsQuery.data;
  const rows = listQuery.data ?? [];

  const fmtDate = (d: Date | string) => {
    try {
      const dt = typeof d === "string" ? new Date(d) : d;
      return dt.toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  const summary = useMemo(
    () => [
      { l: "전체 신청", v: stats?.total ?? 0 },
      { l: "대기", v: stats?.pending ?? 0 },
      { l: "연락완료", v: stats?.contacted ?? 0 },
      { l: "계약완료", v: stats?.contracted ?? 0 },
    ],
    [stats],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Gate
        title="관리자 로그인이 필요합니다"
        desc="신청 데이터를 조회하려면 관리자 계정으로 로그인해 주세요."
        action={
          <Button asChild size="lg" className="rounded-full">
            <a href={getLoginUrl()}>로그인하기</a>
          </Button>
        }
      />
    );
  }

  if (!isAdmin) {
    return (
      <Gate
        title="접근 권한이 없습니다"
        desc={`현재 계정(${user?.name ?? user?.email ?? "사용자"})에는 관리자 권한이 없습니다. 오너에게 권한 부여를 요청해 주세요.`}
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">홈으로</Link>
            </Button>
            <Button onClick={() => logout()} className="rounded-full">
              <LogOut className="mr-1.5 h-4 w-4" /> 로그아웃
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Admin
              </div>
              <div className="text-base font-bold tracking-tight">신청 관리 대시보드</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.name ?? user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="mr-1.5 h-4 w-4" /> 로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Summary */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {summary.map(s => (
            <div
              key={s.l}
              className="rounded-xl border border-border bg-background p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {s.l}
              </div>
              <div className="num-display mt-2 text-3xl font-black">{s.v}</div>
            </div>
          ))}
        </section>

        {/* Filters */}
        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            필터
          </div>
          <Select value={carrier} onValueChange={v => setCarrier(v as CarrierFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="통신사" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 통신사</SelectItem>
              <SelectItem value="SK">SK</SelectItem>
              <SelectItem value="LG">LG</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={v => setStatus(v as StatusFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체 상태</SelectItem>
              {STATUSES.map(s => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              listQuery.refetch();
              statsQuery.refetch();
            }}
            className="ml-auto"
          >
            <RefreshCcw className="mr-1.5 h-4 w-4" /> 새로고침
          </Button>
        </section>

        {/* Table */}
        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">통신사</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead className="min-w-[280px]">주소</TableHead>
                  <TableHead>요금제</TableHead>
                  <TableHead>설치 희망일</TableHead>
                  <TableHead>접수일시</TableHead>
                  <TableHead className="w-[170px]">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                      조건에 맞는 신청이 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <span className="inline-flex h-7 w-9 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold">
                          {r.carrier}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="num-display">{r.phone}</TableCell>
                      <TableCell className="max-w-[360px] truncate text-sm text-muted-foreground" title={r.address}>
                        {r.address}
                      </TableCell>
                      <TableCell className="num-display font-bold">{r.plan}</TableCell>
                      <TableCell className="num-display">{r.installDate}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{fmtDate(r.createdAt as any)}</TableCell>
                      <TableCell>
                        <Select
                          value={r.status}
                          disabled={updateMutation.isPending}
                          onValueChange={v =>
                            updateMutation.mutate({
                              id: r.id,
                              status: v as (typeof STATUSES)[number],
                            })
                          }
                        >
                          <SelectTrigger className={`h-8 rounded-full px-3 text-xs font-bold ${statusBadge(r.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map(s => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </div>
  );
}

function Gate({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background text-sm font-bold">
          ADM
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
        <div className="mt-6 flex justify-center">{action}</div>
      </div>
    </div>
  );
}
