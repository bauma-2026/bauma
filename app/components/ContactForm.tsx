"use client";

import { useMemo, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(
      `Bauma — povpraševanje (${name || "ime"})`
    );

    const body = encodeURIComponent(
      `Ime: ${name}\nEmail: ${email}\n\nKratek opis:\n${msg}\n`
    );

    return `mailto:info@bauma.si?subject=${subject}&body=${body}`;
  }, [name, email, msg]);

  const inputBase =
    "w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-neutral-400";

  return (
    <div>
      <div className="text-lg font-semibold tracking-tight text-neutral-950">
        Pošlji sporočilo
      </div>

      <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-neutral-600">
        Najbolj pomaga, če na kratko napišeš, kaj ponujate, kaj je glavni problem
        trenutne strani in kaj želite izboljšati.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
            Ime
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vaše ime"
            className={inputBase}
          />
        </label>

        <label className="block">
          <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
            Email
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ime@podjetje.si"
            className={inputBase}
          />
        </label>
      </div>

      <label className="mt-5 block">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          Sporočilo
        </div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Na kratko opiši, kaj ponujate, kaj trenutno ne deluje in kaj želite izboljšati..."
          rows={7}
          className={`${inputBase} min-h-[180px] resize-none`}
        />
      </label>

      <div className="mt-6">
        <a
          href={mailto}
          className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-sm font-medium tracking-tight text-white transition-all duration-200 ease-out hover:-translate-y-[1px] hover:bg-white hover:text-black active:translate-y-0"
        >
          Pošlji povpraševanje
        </a>
      </div>

     
    </div>
  );
}