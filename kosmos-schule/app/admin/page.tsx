"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Shell, { Card } from "../../components/Shell";
import { useStore, upsert } from "../../lib/store";

const tabs = ["Übersicht", "Kalender", "Events", "Ankündigungen"];

const typen = [
  "Ferien",
  "Prüfung",
  "Projekttage",
  "Elternabend",
  "Schulveranstaltung",
  "Feiertag"
];

function Manager({
  name,
  fields,
  items,
  save,
  remove
}: {
  name: string;
  fields: any[];
  items: any[];
  save: (x: any) => void;
  remove: (id: string) => void;
}) {
  const [f, setF] = useState<any>({});

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card title={f.id ? `${name} bearbeiten` : `${name} erstellen`}>
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            save(f);
            setF({});
          }}
        >
          {fields.map(([k, l, t, o]) =>
            t === "check" ? (
              <label key={k} className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!f[k]}
                  onChange={(e) => setF({ ...f, [k]: e.target.checked })}
                />
                {l}
              </label>
            ) : (
              <label key={k} className="text-sm grid gap-1">
                {l}

                {t === "area" ? (
                  <textarea
                    required
                    value={f[k] ?? ""}
                    onChange={(e) => setF({ ...f, [k]: e.target.value })}
                  />
                ) : t === "select" ? (
                  <select
                    value={f[k] ?? o[0]}
                    onChange={(e) => setF({ ...f, [k]: e.target.value })}
                  >
                    {o.map((x: string) => <option key={x}>{x}</option>)}
                  </select>
                ) : (
                  <input
                    type={t}
                    required={k !== "bild"}
                    value={f[k] ?? ""}
                    onChange={(e) => setF({ ...f, [k]: e.target.value })}
                  />
                )}
              </label>
            )
          )}

          <div className="flex gap-2">
            <button className="btn">Speichern</button>
            {f.id && (
              <button type="button" className="btn" onClick={() => setF({})}>
                Abbrechen
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card title={`${name} (${items.length})`}>
        {items.map((i) => (
          <div key={i.id} className="flex justify-between gap-2 border-b border-slate-100 py-2 text-sm">
            <div>
              <b>{i.titel}</b>
              <div className="text-slate-500">
                {i.datum || i.von}
                {i.bis && i.bis !== i.von ? ` – ${i.bis}` : ""}
                {i.veroeffentlicht === false && " · Entwurf"}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setF(i)}>
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(i.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default function Page() {
  const { d, set } = useStore();
  const [tab, setTab] = useState(tabs[0]);

  if (d.user?.role === "schueler") {
    return (
      <Shell>
        <p>Kein Zugriff – bitte als Lehrer oder Admin anmelden.</p>
      </Shell>
    );
  }

  const del = (k: string) => (id: string) =>
    set((x: any) => ({
      ...x,
      [k]: x[k].filter((i: any) => i.id !== id)
    }));

  const sv = (k: string, def: any) => (f: any) =>
    set((x: any) => ({
      ...x,
      [k]: upsert(x[k], f, def)
    }));

  const stats = [
    ["Schüler", 312],
    ["Lehrer", 28],
    ["Klassen", 14],
    ["Kommende Events", d.events.length],
    ["Ankündigungen", d.news.length],
    ["Kalendertermine", d.calendar.length]
  ];

  return (
    <Shell>
      <div className="rounded-3xl bg-[#0b1d3f] text-white p-6 mb-4">
        <h1 className="text-2xl font-bold">Schulverwaltung</h1>

        <div className="flex gap-2 mt-3 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-xl px-4 py-2 text-sm whitespace-nowrap transition ${
                tab === t
                  ? "bg-white text-[#0b1d3f]"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === "Übersicht" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map(([l, v]) => (
            <Card key={l as string} title={l as string}>
              <p className="text-3xl font-bold">{v}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "Kalender" && (
        <Manager
          name="Termin"
          items={d.calendar}
          remove={del("calendar")}
          save={sv("calendar", {
            typ: "Schulveranstaltung",
            veroeffentlicht: false
          })}
          fields={[
            ["titel", "Titel", "text"],
            ["von", "Von", "date"],
            ["bis", "Bis", "date"],
            ["typ", "Art", "select", typen],
            ["veroeffentlicht", "Veröffentlicht", "check"]
          ]}
        />
      )}

      {tab === "Events" && (
        <Manager
          name="Event"
          items={d.events}
          remove={del("events")}
          save={sv("events", { veroeffentlicht: false })}
          fields={[
            ["titel", "Titel", "text"],
            ["datum", "Datum", "date"],
            ["zeit", "Uhrzeit", "time"],
            ["ort", "Ort", "text"],
            ["bild", "Bild-URL (optional)", "text"],
            ["text", "Beschreibung", "area"],
            ["veroeffentlicht", "Veröffentlicht", "check"]
          ]}
        />
      )}

      {tab === "Ankündigungen" && (
        <Manager
          name="Ankündigung"
          items={d.news}
          remove={del("news")}
          save={sv("news", {
            datum: new Date().toISOString().slice(0, 10)
          })}
          fields={[
            ["titel", "Titel", "text"],
            ["text", "Text", "area"]
          ]}
        />
      )}
    </Shell>
  );
}
