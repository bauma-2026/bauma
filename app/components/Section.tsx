import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  withDivider?: boolean;
  variant?: "default" | "tight";
};

export default function Section({
  children,
  className = "",
  withDivider = true,
  variant = "default",
}: SectionProps) {
  const spacing =
    variant === "tight"
      ? "py-10 sm:py-12 lg:py-14"
      : "py-12 sm:py-14 lg:py-16";

  return (
    <section
      className={[
        withDivider ? "border-t border-neutral-200" : "",
        spacing,
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}