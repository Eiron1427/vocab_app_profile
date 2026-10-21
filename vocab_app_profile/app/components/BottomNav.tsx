"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Gamepad2, User, ShoppingBag } from "lucide-react";

const NAV_ITEMS = [
  { href: "/lessons", icon: BookOpen, label: "Lessons" },
  { href: "/quizzes", icon: Gamepad2, label: "Quizzes" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/shop", icon: ShoppingBag, label: "Shop" },
] as const;

export default function BottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Main"
      className="flex items-center justify-between rounded-[22px] bg-white/75 px-3 py-2 backdrop-blur-sm"
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex w-[78px] flex-col items-center rounded-xl px-2 py-2 transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              active
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-neutral-200"
            }`}
          >
            <Icon className="h-8 w-8" strokeWidth={active ? 2.6 : 2.2} aria-hidden="true" />
            <span className={`text-[13px] ${active ? "font-bold" : "font-semibold"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}