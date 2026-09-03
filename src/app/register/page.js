import RegisterForm from "./RegisterForm";
import SiteShell from "@/components/SiteShell";
import { getPage } from "@/server/queries/public";

export default async function RegisterPage() {
  const page = await getPage("register");
  return (
    <SiteShell showJoin={false}>
      <RegisterForm page={page} />
    </SiteShell>
  );
}
