import Image from "next/image";

import { CROP_OBJECT_POSITION, type CropKey } from "./constants";

type ProofScreenshotProps = {
  src: string;
  alt: string;
  crop: CropKey;
  className?: string;
  band?: boolean;
};

export default function ProofScreenshot({
  src,
  alt,
  crop,
  className = "",
  band = false,
}: ProofScreenshotProps) {
  return (
    <div
      className={[
        "relative overflow-hidden bg-[#0e0e0e]",
        band ? "border-y border-white/10" : "border border-white/10",
        className,
      ].join(" ")}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition: CROP_OBJECT_POSITION[crop] }}
        sizes="(max-width: 1024px) 100vw, 900px"
        priority={crop === "top"}
      />
    </div>
  );
}
