"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Shell, { Card } from "../../components/Shell";
import { useStore, upsert } from "../../lib/store";

const leer = {
  fach: "",
  titel: "",
  beschreibung: "",
  faellig: "",
  prio: "mittel",
  erledigt: false
};

export default function Page() {
  const { d, set } = useStore();
  const [f, setF] = useState<any>(leer);

  const s = (k: string) => ({
    value: f[k],
    onChange: (e: any) => setF({ ...f, [k]: e.target.value })
  });

  const upd = (id: string, p: any) =>
    set((x) => ({
      ...x,
      tasks: x.tasks.map((t) => (t.id === id ? { ...t, ...p } : t))
    }));

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Meine Aufgaben</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card title={f.id ? "Aufgabe bearbeiten" : "Neue Aufgabe"}>
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              set((x) => ({ ...x, tasks: upsert(x.tasks, f) }));
              setF(leer);
            }}
          >
            <input required placeholder="Fach" {...s("fach")} />
            <input required placeholder="Titel" {...s("titel")} />
            <textarea placeholder="Beschreibung" {...s("beschreibung")} />
            <input type="date" required {...s("faellig")} />

            <select {...s("prio")}>
              <option>hoch</option>
              <option>mittel</option>
              <option>niedrig</option>
            </select>

            <button className="btn">Speichern</button>
          </form>
        </Card>

        <Card title="Liste" className="lg:col-span-2">
          {[...d.tasks]
            .sort((a, b) => Number(a.erledigt) - Number(b.erledigt) || a.faellig.localeCompare(b.faellig))
            .map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3 border-b border-slate-100">
                <input
                  type="checkbox"
                  checked={t.erledigt}
                  onChange={() => upd(t.id, { erledigt: !t.erledigt })}
                />

                <div className={`flex-1 text-sm ${t.erledigt ? "line-through text-slate-400" : ""}`}>
                  <b>{t.fach}</b> – {t.titel}
                  <div className="text-slate-500">
                    {t.beschreibung} · fällig {t.faellig} · Priorität {t.prio}
                  </div>
                </div>

                <button onClick={() => setF(t)}>
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() =>
                    set((x) => ({
                      ...x,
                      tasks: x.tasks.filter((z) => z.id !== t.id)
                    }))
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
        </Card>
      </div>
    </Shell>
  );
}
