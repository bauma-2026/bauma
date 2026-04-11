type Props = {
  eyebrow?: string;
  title: string;
  desc?: string;
  as?: "h1" | "h2";
};

export default function SectionHeader({
  eyebrow,
  title,
  desc,
  as = "h2",
}: Props) {
  const Heading = as;

  return (
    <div className="max-w-[56ch]">
      {eyebrow && <p className="text-meta">{eyebrow}</p>}

      <Heading
        className={[
          "mt-3 font-semibold tracking-tight text-neutral-950",
          as === "h1" ? "text-h1" : "text-lg",
        ].join(" ")}
      >
        {title}
      </Heading>

      {desc && <p className="mt-4 text-body">{desc}</p>}
    </div>
  );
}