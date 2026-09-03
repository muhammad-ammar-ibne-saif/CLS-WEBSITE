import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }) {
  await requireAdmin();
  return children;
}
