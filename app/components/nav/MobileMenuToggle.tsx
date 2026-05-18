"use client";

type Props = {
  open: boolean;
  onToggle: () => void;
};

export default function MobileMenuToggle({ open, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-label={open ? "Zapri meni" : "Odpri meni"}
      aria-expanded={open}
      onClick={onToggle}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#080808] text-white transition-all duration-200 ease-out hover:border-white/25 hover:bg-white/[0.04] active:scale-95"
    >
      <span
        className={[
          "absolute block h-[1.5px] w-[14px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          open ? "translate-y-0 rotate-45" : "-translate-y-[3px] rotate-0",
        ].join(" ")}
      />

      <span
        className={[
          "absolute block h-[1.5px] w-[14px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          open ? "translate-y-0 -rotate-45" : "translate-y-[3px] rotate-0",
        ].join(" ")}
      />
    </button>
  );
}