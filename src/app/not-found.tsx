import Link from "next/link";
import { Map, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-background px-4 py-16">
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-primary">
          <Map size={28} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">축제를 찾지 못했습니다</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          주소가 바뀌었거나 아직 검수되지 않은 축제일 수 있습니다. 목록에서 다시 찾아보세요.
        </p>
        <Link href="/" className="press-button mt-6 h-11 rounded-lg px-5 text-sm font-semibold">
          <Search size={17} className="mr-2 shrink-0" />
          축제 둘러보기
        </Link>
      </div>
    </div>
  );
}
