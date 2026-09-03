import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import { PAGE_KEYS } from "@/config/constants";
import { defaultPages } from "@/config/defaults";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Pages" };

export default async function AdminPagesIndex() {
  const user = await requireAdmin();
  return (
    <DashShell title="Page copy" user={user}>
      <p className="body">Heroes, ledes, banners, and calligraphy for every public route.</p>
      <div className="dash-list">
        {PAGE_KEYS.map((key) => (
          <Link className="dash-item" key={key} href={`/admin/pages/${key}`}>
            <strong>{key}</strong>
            <span>{defaultPages[key]?.title}</span>
          </Link>
        ))}
      </div>
    </DashShell>
  );
}
