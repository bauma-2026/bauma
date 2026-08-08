"use client";

import Link from "next/link";

import type { WorkPreviewProject } from "./workPreviewData";

function PreviewImage({
  image,
  priority = false,
}: {
  image: WorkPreviewProject["images"][number];
  priority?: boolean;
}) {
  return (
    <picture className="block w-full overflow-hidden rounded-[12px] border border-white/10 bg-[#0e0e0e] sm:rounded-[14px]">
      <source media="(max-width: 767px)" srcSet={image.mobile} type="image/webp" />
      <img
        src={image.desktop}
        alt={image.alt}
        className="block h-auto w-full"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}

export default function WorkPreviewContent({
  project,
  compactIntro = false,
}: {
  project: WorkPreviewProject;
  compactIntro?: boolean;
}) {
  return (
    <div
      className={[
        "px-5 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12",
        compactIntro ? "pt-2 sm:pt-4" : "pt-4 sm:pt-6",
      ].join(" ")}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 lg:items-start">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
            {project.eyebrow}
          </p>
          <h2
            id={workPreviewTitleId(project.id)}
            className="mt-2 text-2xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-3xl"
          >
            {project.projectName}
          </h2>
          <p className="mt-4 whitespace-pre-line text-lg font-semibold leading-[1.08] tracking-[-0.025em] text-white/88 sm:text-xl">
            {project.title}
          </p>
          <p className="mt-4 max-w-[48ch] text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            {project.summary}
          </p>
          <Link
            href={project.caseHref}
            className="mt-6 inline-flex text-sm font-medium text-white/65 transition hover:text-white"
          >
            {project.ctaLabel}
          </Link>
        </div>

        <dl className="grid gap-4 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-1">
          {project.proof.map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                {item.label}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-white/55">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        className={[
          "space-y-5 sm:space-y-6",
          compactIntro ? "mt-7 sm:mt-8" : "mt-8 sm:mt-10",
        ].join(" ")}
      >
        {project.images.map((image, index) => (
          <PreviewImage key={image.desktop} image={image} priority={index === 0} />
        ))}
      </div>
    </div>
  );
}

export function workPreviewTitleId(id: string) {
  return `work-preview-title-${id}`;
}
