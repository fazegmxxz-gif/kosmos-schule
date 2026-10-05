"use client";

import Shell, { Card } from "../../components/Shell";
import { useStore } from "../../lib/store";

export default function Page() {
  const { d } = useStore();
  const now = new Date();
  const iso = now.toISOString().slice(0, 10);

  const heute = d.lessons
    .filter((l) => l.tag === (now.getDay() + 6) % 7)
    .sort((a, b) => a.start.localeCompare(b.start));

  const offen = d.tasks
    .filter((t) => !t.erledigt)
    .sort((a, b) => a.faellig.localeCompare(b.faellig));

  const evs = d.events
    .filter((e) => e.veroeffentlicht && e.datum >= iso)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 3);

  return (
    <Shell>
      <div className="rounded-3xl bg-gradient-to-r from-[#0b1d3f] to-[#2a4b9b] text-white p-6 md:p-8 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Hallo, {d.user?.name} 👋</h1>
        <p className="opacity-80">Schön, dass du wieder da bist! Hier ist dein Überblick.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <Card title="Offene Aufgaben">
          <p className="text-3xl font-bold">{offen.length}</p>
        </Card>
        <Card title="Nächste Stunde">
          <p className="text-xl font-bold">
            {heute[0] ? `${heute[0].fach} · ${heute[0].start}` : "Heute frei 🎉"}
          </p>
        </Card>
        <Card title="Nächstes Event">
          <p className="text-xl font-bold">{evs[0]?.titel ?? "–"}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Heutiger Stundenplan">
          {heute.length === 0 && <p className="text-sm text-slate-500">Keine Stunden heute.</p>}
          {heute.map((l) => (
            <div
              key={l.id}
              className="rounded-xl p-3 mb-2 text-sm"
              style={{
                background: l.farbe + "22",
                borderLeft: `4px solid ${l.farbe}`
              }}
            >
              <b>{l.fach}</b> · {l.start}–{l.ende} · Raum {l.raum}
            </div>
          ))}
        </Card>

        <Card title="Anstehende Abgaben">
          {offen.slice(0, 4).map((t) => (
            <div key={t.id} className="flex justify-between text-sm py-2 border-b border-slate-100">
              <span><b>{t.fach}</b> – {t.titel}</span>
              <span className="text-slate-500">{t.faellig}</span>
            </div>
          ))}
        </Card>

        <Card title="Kommende Events">
          {evs.map((e) => (
            <div key={e.id} className="text-sm py-2 border-b border-slate-100">
              <b>{e.titel}</b> · {e.datum} · {e.zeit}
            </div>
          ))}
        </Card>

        <Card title="Wichtige Nachrichten">
          {[...d.news].reverse().slice(0, 3).map((n) => (
            <div key={n.id} className="text-sm py-2 border-b border-slate-100">
              <b>{n.titel}</b><br />{n.text}
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}
