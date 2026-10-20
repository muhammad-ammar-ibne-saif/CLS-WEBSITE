import RegisterForm from "./RegisterForm";
import SiteShell from "@/components/SiteShell";
import { getPage, getSettings } from "@/server/queries/public";

export const metadata = { title: "Register" };
export const revalidate = 300;

export default async function RegisterPage() {
  const [page, settings] = await Promise.all([getPage("register"), getSettings()]);
  return (
    <SiteShell showJoin={false}>
      <RegisterForm page={page} calligraphy={settings.ctaCalligraphy || "/assets/calligraphy-cta.png"} />
    </SiteShell>
  );
}
