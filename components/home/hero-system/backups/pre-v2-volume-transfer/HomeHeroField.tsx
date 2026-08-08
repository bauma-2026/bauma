import HomeHeroVisual from "./HomeHeroVisual";

type HomeHeroFieldProps = {
  variant: "desktop" | "mobile";
};

const FIELD_CLASS = {
  desktop: "relative h-[440px] w-full",
  mobile: "relative h-[232px] w-full sm:h-[240px] md:h-[256px]",
} as const;

export default function HomeHeroField({ variant }: HomeHeroFieldProps) {
  return <HomeHeroVisual className={FIELD_CLASS[variant]} />;
}
