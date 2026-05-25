import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "동네축제 | 구석구석 우리 동네 축제 통합 검색",
  description: "대한민국 구석구석 매력적인 축제, 지역 문화 행사, 음악 버스킹을 한눈에 둘러보고 직접 제보하는 개방형 로컬 축제 허브입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 relative">
          {children}
        </main>
        <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground bg-background">
          <div className="container mx-auto px-4 space-y-1">
            <p className="font-semibold">&copy; {new Date().getFullYear()} 동네축제</p>
            <p className="text-xs">우리 동네 축제를 한눈에 찾아보세요</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
