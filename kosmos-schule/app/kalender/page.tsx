"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Shell, { Card } from "../../components/Shell";
import { useStore } from "../../lib/store";

const farben: any = {
  Ferien: "bg-emerald-100 text-emerald-700",
  Prüfung: "bg-rose-100 text-rose-700",
  Schulveranstaltung: "bg-violet-100 text-violet-700",
  Elternabend: "bg-amber-100 text-amber-700",
  Projekttage: "bg-sky-100 text-sky-700"
};

export default function Page() {
  const { d } = useStore();

  const [m, setM] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const y = m.getFullYear();
  const mo = m.getMonth();
  const off = (m.getDay() + 6) % 7;
  const n = new Date(y, mo + 1, 0).getDate();

  const list = d.calendar
    .filter((c) => c.veroeffentlicht)
    .sort((a, b) => a.von.localeCompare(b.von));

  const iso = (day: number) =>
    `${y}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Schulkalender</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => setM(new Date(y, mo - 1, 1))}>
              <ChevronLeft />
            </button>
            <b>{m.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</b>
            <button onClick={() => setM(new Date(y, mo + 1, 1))}>
              <ChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((t) => (
              <div key={t} className="text-slate-400">{t}</div>
            ))}

            {Array.from({ length: off }).map((_, i) => <div key={"o" + i} />)}

            {Array.from({ length: n }, (_, i) => i + 1).map((day) => {
              const ev = list.filter((c) => c.von <= iso(day) && iso(day) <= c.bis);

              return (
                <div
                  key={day}
                  className="min-h-14 rounded-xl border border-slate-100 p-1 hover:bg-slate-50 transition"
                >
                  {day}
                  {ev.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={`truncate rounded px-1 mt-0.5 ${farben[e.typ] || "bg-slate-100"}`}
                    >
                      {e.titel}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Alle Termine">
          {list.map((c) => (
            <div key={c.id} className="py-2 border-b border-slate-100 text-sm">
              <b>{c.titel}</b>
              <div className="text-slate-500">
                {c.von}{c.bis !== c.von && ` – ${c.bis}`} · {c.typ}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}
