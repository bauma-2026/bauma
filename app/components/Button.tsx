import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 ease-out";

  const primary =
    "border border-black bg-black text-white hover:bg-white hover:text-black";

  const secondary =
    "border border-black/20 bg-white/70 text-black hover:bg-black hover:text-white hover:border-black";

  return (
    <Link
      href={href}
      className={`${base} ${
        variant === "primary" ? primary : secondary
      } hover:-translate-y-[1px] active:translate-y-0 ${className}`}
    >
      {children}
    </Link>
  );
}