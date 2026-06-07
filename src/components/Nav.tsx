"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RadarLogo } from "@/components/ui/RadarLogo";
import { classNames } from "@/lib/format";

const LINKS = [
  { href: "/", label: "Dashboard", icon: "◎" },
  { href: "/scholarships", label: "Scholarships", icon: "✦" },
  { href: "/essay-tool", label: "Essay Tool", icon: "✍" },
  { href: "/profile", label: "Profile", icon: "☻" },
];

export function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
        <div className="container-app flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <RadarLogo size={30} animated />
            <span className="font-display text-lg font-semibold tracking-tight">
              Scholarship<span className="text-brand">Radar</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={classNames(
                  "rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                  isActive(l.href)
                    ? "bg-brand text-white shadow-card"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Bottom bar (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 backdrop-blur-md sm:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={classNames(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition",
                isActive(l.href) ? "text-brand" : "text-ink-faint"
              )}
            >
              <span className="text-base leading-none">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
