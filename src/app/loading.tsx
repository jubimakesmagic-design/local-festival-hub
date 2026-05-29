import { CalendarRange, Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 py-5 pb-24 md:px-6 md:py-10">
        <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-sm md:mb-8 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="h-8 w-44 animate-pulse rounded-full bg-secondary" />
              <div className="h-10 w-full max-w-xl animate-pulse rounded bg-secondary" />
              <div className="h-5 w-full max-w-lg animate-pulse rounded bg-secondary" />
            </div>
            <div className="grid w-full grid-cols-3 gap-2 md:w-auto md:min-w-[400px] md:gap-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="min-h-24 rounded-lg border border-border bg-background p-3">
                  <div className="mb-5 h-5 w-20 animate-pulse rounded bg-secondary" />
                  <div className="h-7 w-14 animate-pulse rounded bg-secondary" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-sm md:mb-6 md:p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <CalendarRange size={20} className="text-primary" />
              <span>축제 정보를 불러오는 중입니다</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="h-14 animate-pulse rounded-lg bg-secondary" />
              <div className="h-14 animate-pulse rounded-lg bg-secondary" />
            </div>
            <div className="flex items-center gap-2">
              <Search size={20} className="text-muted-foreground" />
              <div className="h-14 flex-1 animate-pulse rounded-lg bg-secondary" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-72 animate-pulse rounded-lg border border-border bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
