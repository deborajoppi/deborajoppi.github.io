"use client";

import { useLanguage } from "@/app/components/language-provider";
import { getCopy } from "@/app/lib/site-copy";
import StatsLabPage from "@/app/components/stats-lab";

export default function ScienceStatsPage() {
  const { language } = useLanguage();
  const copy = getCopy(language);

  return <StatsLabPage backHref="/science" backLabel={copy.stats.backScience} />;
}
