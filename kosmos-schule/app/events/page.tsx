"use client";

import Shell from "../../components/Shell";
import { useStore } from "../../lib/store";

export default function Page() {
  const { d, set } = useStore();

  const list = d.events
    .filter((e) => e.veroeffentlicht)
    .sort((a, b) => a.datum.localeCompare(b.datum));

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
          >
            <div
              className="h-36 bg-gradient-to-br from-indigo-300 to-sky-200 bg-cover bg-center"
              style={e.bild ? { backgroundImage: `url(${e.bild})` } : {}}
            />

            <div className="p-5 text-sm">
              <h3 className="font-semibold text-base">{e.titel}</h3>
              <p className="text-slate-500">{e.datum} · {e.zeit} · {e.ort}</p>
              <p className="my-2">{e.text}</p>

              <button
                className="btn"
                onClick={() =>
                  set((x) => ({
                    ...x,
                    events: x.events.map((v) =>
                      v.id === e.id ? { ...v, angemeldet: !v.angemeldet } : v
                    )
                  }))
                }
              >
                {e.angemeldet ? "✓ Angemeldet" : "Anmelden"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
