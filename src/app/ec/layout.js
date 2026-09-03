import DashShell from "@/components/admin/DashShell";
import { requireEc } from "@/server/dal";

export default async function EcLayout({ children }) {
  await requireEc();
  return children;
}
