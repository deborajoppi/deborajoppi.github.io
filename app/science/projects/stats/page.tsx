"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";
import StatsLabPage from "@/app/components/stats-lab";

export default function ProjectStatsPage() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return <StatsLabPage backHref="/science/projects" backLabel={copy.stats.backProjects} />;
}
