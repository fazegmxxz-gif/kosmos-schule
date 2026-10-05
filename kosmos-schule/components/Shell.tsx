"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Home,
  CalendarDays,
  CheckSquare,
  Star,
  Table,
  Shield,
  LogOut,
  Rocket,
  LucideIcon
} from "lucide-react";
import { useStore } from "../lib/store";

const nav: [string, string, LucideIcon][] = [
  ["/dashboard", "Dashboard", Home],
  ["/stundenplan", "Stundenplan", Table],
  ["/kalender", "Kalender", CalendarDays],
  ["/aufgaben", "Aufgaben", CheckSquare],
  ["/events", "Events", Star]
];

export const Card = ({
  title,
  children,
  className = ""
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition ${className}`}>
    {title && <h2 className="font-semibold mb-3">{title}</h2>}
    {children}
  </section>
);

export default function Shell({ children }: { children: React.ReactNode }) {
  const { d, set, ready } = useStore();
  const p = usePathname();
  const r = useRouter();

  useEffect(() => {
    if (ready && !d.user) r.replace("/");
  }, [ready, d.user, r]);

  if (!ready || !d.user) return null;

  const items =
    d.user.role === "schueler"
      ? nav
      : [...nav, ["/admin", "Admin", Shield] as [string, string, LucideIcon]];

  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-[#0b1d3f] text-white md:w-60 md:min-h-screen p-3 md:p-4 flex md:flex-col gap-1 overflow-x-auto md:sticky md:top-0 md:h-screen">
        <div className="hidden md:flex items-center gap-2 px-2 py-4 font-bold text-lg">
          <Rocket size={22} /> Kosmos Schule
        </div>

        {items.map(([h, l, I]) => (
          <Link
            key={h}
            href={h}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition ${
              p === h ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            <I size={18} /> {l}
          </Link>
        ))}

        <button
          onClick={() => set((x) => ({ ...x, user: null }))}
          className="md:mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap hover:bg-white/10"
        >
          <LogOut size={18} /> Abmelden ({d.user.name})
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8 min-w-0 max-w-6xl">{children}</main>
    </div>
  );
}
