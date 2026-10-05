"use client";

import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { useStore, Role } from "../lib/store";

const accounts: [string, Role, string][] = [
  ["Lena", "schueler", "Als Schülerin anmelden"],
  ["Herr Weber", "lehrer", "Als Lehrer anmelden"],
  ["Admin", "admin", "Als Administrator anmelden"]
];

export default function Login() {
  const { set } = useStore();
  const r = useRouter();

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0b1d3f] to-[#2a4b9b] p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl text-center">
        <Rocket className="mx-auto mb-2" size={36} />
        <h1 className="text-2xl font-bold">Kosmos Schule</h1>
        <p className="text-slate-500 text-sm mb-6">Gemeinsam. Lernen. Wachsen.</p>

        <div className="grid gap-3">
          {accounts.map(([name, role, label]) => (
            <button
              key={role}
              className="btn"
              onClick={() => {
                set((x) => ({ ...x, user: { name, role } }));
                r.push(role === "admin" ? "/admin" : "/dashboard");
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-4">Demo-Anmeldung ohne Passwort</p>
      </div>
    </div>
  );
}
