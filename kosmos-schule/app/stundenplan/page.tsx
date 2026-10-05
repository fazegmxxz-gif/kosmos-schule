"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Shell, { Card } from "../../components/Shell";
import { useStore, upsert } from "../../lib/store";

const tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

const leer = {
  fach: "",
  lehrer: "",
  raum: "",
  tag: 0,
  start: "08:00",
  ende: "09:30",
  farbe: "#3b82f6"
};

export default function Page() {
  const { d, set } = useStore();
  const [f, setF] = useState<any>(null);
  const [edit, setEdit] = useState(false);

  const s = (k: string) => ({
    value: f?.[k] ?? "",
    onChange: (e: any) => setF({ ...f, [k]: e.target.value })
  });

  return (
    <Shell>
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <h1 className="text-2xl font-bold">Mein Stundenplan</h1>
        <div className="flex gap-2">
          <button className="btn" onClick={() => setF({ ...leer })}>
            Stunde hinzufügen
          </button>
          <button className="btn" onClick={() => setEdit(!edit)}>
            {edit ? "Fertig" : "Stundenplan bearbeiten"}
          </button>
        </div>
      </div>

      {f && (
        <Card className="mb-4">
          <form
            className="grid sm:grid-cols-3 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              set((x) => ({
                ...x,
                lessons: upsert(x.lessons, { ...f, tag: Number(f.tag) })
              }));
              setF(null);
            }}
          >
            <input required placeholder="Fach" {...s("fach")} />
            <input placeholder="Lehrer" {...s("lehrer")} />
            <input placeholder="Raum" {...s("raum")} />

            <select
              value={f.tag}
              onChange={(e) => setF({ ...f, tag: Number(e.target.value) })}
            >
              {tage.map((t, i) => <option key={t} value={i}>{t}</option>)}
            </select>

            <input type="time" required {...s("start")} />
            <input type="time" required {...s("ende")} />
            <input type="color" {...s("farbe")} />

            <button className="btn">Speichern</button>
            <button type="button" className="btn" onClick={() => setF(null)}>
              Abbrechen
            </button>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-5 gap-3">
        {tage.map((t, i) => (
          <div key={t}>
            <div className="font-semibold text-center mb-2">{t}</div>

            {d.lessons
              .filter((l) => l.tag === i)
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((l) => (
                <div
                  key={l.id}
                  onClick={() => edit && setF(l)}
                  className={`relative rounded-2xl p-3 mb-2 text-sm transition hover:-translate-y-0.5 ${
                    edit ? "cursor-pointer" : ""
                  }`}
                  style={{
                    background: l.farbe + "26",
                    borderLeft: `4px solid ${l.farbe}`
                  }}
                >
                  <b>{l.fach}</b>
                  <div className="text-slate-600">{l.start}–{l.ende}</div>
                  <div className="text-slate-500">{l.lehrer} · {l.raum}</div>

                  {edit && (
                    <button
                      className="absolute top-1 right-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        set((x) => ({
                          ...x,
                          lessons: x.lessons.filter((z) => z.id !== l.id)
                        }));
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}
