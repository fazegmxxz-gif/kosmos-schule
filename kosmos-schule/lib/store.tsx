"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "schueler" | "lehrer" | "admin";

export type Lesson = {
  id: string;
  fach: string;
  lehrer: string;
  raum: string;
  tag: number;
  start: string;
  ende: string;
  farbe: string;
};

export type Task = {
  id: string;
  fach: string;
  titel: string;
  beschreibung: string;
  faellig: string;
  prio: string;
  erledigt: boolean;
};

export type CalEvent = {
  id: string;
  titel: string;
  von: string;
  bis: string;
  typ: string;
  veroeffentlicht: boolean;
};

export type SchoolEvent = {
  id: string;
  titel: string;
  datum: string;
  zeit: string;
  ort: string;
  text: string;
  bild: string;
  veroeffentlicht: boolean;
  angemeldet?: boolean;
};

export type News = {
  id: string;
  titel: string;
  text: string;
  datum: string;
};

export type Data = {
  user: { name: string; role: Role } | null;
  lessons: Lesson[];
  tasks: Task[];
  calendar: CalEvent[];
  events: SchoolEvent[];
  news: News[];
};

export const uid = () => Math.random().toString(36).slice(2, 9);

export const upsert = (list: any[], x: any, def: any = {}) =>
  x.id
    ? list.map((i) => (i.id === x.id ? x : i))
    : [...list, { ...def, ...x, id: uid() }];

const seed: Data = {
  user: null,
  lessons: [
    { id: "l1", fach: "Mathe", lehrer: "Hr. Weber", raum: "204", tag: 0, start: "08:00", ende: "09:30", farbe: "#3b82f6" },
    { id: "l2", fach: "Deutsch", lehrer: "Fr. Keller", raum: "105", tag: 0, start: "09:45", ende: "11:15", farbe: "#ec4899" },
    { id: "l3", fach: "Englisch", lehrer: "Fr. Moore", raum: "110", tag: 1, start: "08:00", ende: "09:30", farbe: "#8b5cf6" },
    { id: "l4", fach: "Informatik", lehrer: "Hr. Lang", raum: "PC-1", tag: 2, start: "10:00", ende: "11:30", farbe: "#10b981" },
    { id: "l5", fach: "Biologie", lehrer: "Fr. Roth", raum: "Labor", tag: 3, start: "08:00", ende: "09:30", farbe: "#22c55e" },
    { id: "l6", fach: "Sport", lehrer: "Hr. Brandt", raum: "Halle", tag: 4, start: "09:00", ende: "10:30", farbe: "#f59e0b" }
  ],
  tasks: [
    { id: "t1", fach: "Mathe", titel: "Übungsblatt 12", beschreibung: "Algebra, Aufgaben 1–10", faellig: "2026-10-07", prio: "hoch", erledigt: false },
    { id: "t2", fach: "Deutsch", titel: "Gedicht interpretieren", beschreibung: "Mind. 1 Seite", faellig: "2026-10-09", prio: "mittel", erledigt: false },
    { id: "t3", fach: "Englisch", titel: "Vokabeln Unit 4", beschreibung: "", faellig: "2026-10-08", prio: "niedrig", erledigt: false }
  ],
  calendar: [
    { id: "c1", titel: "Mathe-Klausur", von: "2026-10-14", bis: "2026-10-14", typ: "Prüfung", veroeffentlicht: true },
    { id: "c2", titel: "Elternabend", von: "2026-10-20", bis: "2026-10-20", typ: "Elternabend", veroeffentlicht: true },
    { id: "c3", titel: "Herbstferien", von: "2026-10-26", bis: "2026-10-30", typ: "Ferien", veroeffentlicht: true },
    { id: "c4", titel: "Projekttage", von: "2026-11-09", bis: "2026-11-11", typ: "Projekttage", veroeffentlicht: true }
  ],
  events: [
    { id: "e1", titel: "Schulfest", datum: "2026-10-16", zeit: "15:00", ort: "Schulhof", text: "Spiele, Musik und Essen für alle.", bild: "", veroeffentlicht: true },
    { id: "e2", titel: "Fußballturnier", datum: "2026-10-23", zeit: "09:00", ort: "Sportplatz", text: "Klassenturnier – meldet eure Teams an!", bild: "", veroeffentlicht: true },
    { id: "e3", titel: "Workshop Nachhaltigkeit", datum: "2026-11-03", zeit: "14:00", ort: "Raum 2.03", text: "Praktischer Workshop für Klasse 8–10.", bild: "", veroeffentlicht: true }
  ],
  news: [
    { id: "n1", titel: "Willkommen im neuen Schuljahr", text: "Das Portal Kosmos Schule ist ab sofort online.", datum: "2026-10-01" }
  ]
};

const Ctx = createContext<{
  d: Data;
  set: (f: (d: Data) => Data) => void;
  ready: boolean;
}>(null as any);

export function Provider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Data>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("kosmos");
      if (s) setD(JSON.parse(s));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("kosmos", JSON.stringify(d));
  }, [d, ready]);

  return <Ctx.Provider value={{ d, set: setD, ready }}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
