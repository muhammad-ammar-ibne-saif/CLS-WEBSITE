import HistoryView from "./HistoryView";
import SiteShell from "@/components/SiteShell";
import { getPage, getTenures } from "@/server/queries/public";

export default async function HistoryPage() {
  const [page, tenures] = await Promise.all([getPage("history"), getTenures()]);
  return (
    <SiteShell>
      <HistoryView page={page} tenures={tenures} />
    </SiteShell>
  );
}
