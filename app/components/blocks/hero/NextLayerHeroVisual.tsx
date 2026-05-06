"use client";

import { motion } from "framer-motion";

const layers = [
  {
    number: "01",
    title: "Kaj je to",
    text: "Jasno, brez tehničnega šuma.",
  },
  {
    number: "02",
    title: "Ali je zame",
    text: "Takoj ve, ali je to zanj.",
  },
  {
    number: "03",
    title: "Kako deluje",
    text: "Razume brez razmišljanja.",
  },
  {
    number: "04",
    title: "Zakaj verjeti",
    text: "Dokazi odstranijo dvom.",
  },
  {
    number: "05",
    title: "Kaj naredim zdaj",
    text: "Naslednji korak je jasen.",
  },
];

export default function NextLayerHeroVisual() {
  return (
<div className="relative ml-auto w-full max-w-[420px]">
      {/* subtle glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/10 via-transparent to-transparent blur-2xl opacity-30" />

      <div className="space-y-4">
        {layers.map((layer, index) => {
          const opacity = 0.55 + index * 0.1;

          return (
            <motion.div
              key={layer.number}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: opacity, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
                ease: "easeOut",
              }}
              whileHover={{
                opacity: 1,
                y: -2,
                transition: { duration: 0.18 },
              }}
              className="flex gap-4"
            >
              {/* number */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-[11px] text-white/40">
                {layer.number}
              </div>

              {/* content */}
              <div>
                <h4 className="text-sm font-medium tracking-tight text-white/85">
                  {layer.title}
                </h4>
                <p className="mt-1 max-w-[30ch] text-sm leading-6 text-white/55">
                  {layer.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* bottom line */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="text-sm text-white/50">
         Vsak layer te premakne naprej.
        </p>
      </div>
    </div>
  );
}