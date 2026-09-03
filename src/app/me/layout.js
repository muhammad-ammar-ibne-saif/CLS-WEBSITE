import { requireStaff } from "@/server/dal";

export default async function MeLayout({ children }) {
  await requireStaff();
  return children;
}
