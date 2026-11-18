import ComingSoon from "@/components/ComingSoon";
import HistoryView from "./HistoryView";
import SiteShell from "@/components/SiteShell";
import { getPage, getTenures, isComingSoon } from "@/server/queries/public";

export const revalidate = 300;

export default async function HistoryPage() {
  if (await isComingSoon("history")) return <ComingSoon pageKey="history" />;
  const [page, tenures] = await Promise.all([getPage("history"), getTenures()]);
  return (
    <SiteShell>
      <HistoryView page={page} tenures={tenures} />
    </SiteShell>
  );
}
