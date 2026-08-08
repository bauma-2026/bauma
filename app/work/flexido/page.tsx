import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "../../../lib/content";
import CaseStudyPage from "../../components/work/CaseStudyPage";

export const metadata: Metadata = {
  title: "Flexido — Bauma case study",
  description: "Flexido case study preview for Bauma.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FlexidoCasePage() {
  const caseStudy = caseStudies.find((item) => item.slug === "flexido");

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyPage caseStudy={caseStudy} />;
}