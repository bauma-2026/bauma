import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          fontSize: 28,
          fontWeight: 700,
          borderRadius: 14,
        }}
      >
        B
      </div>
    ),
    size
  );
}
