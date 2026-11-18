import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import { GATED_PAGES } from "@/config/constants";
import { saveVisibilityAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";
import { getSettings } from "@/server/queries/public";

export const metadata = { title: "Page visibility" };

export default async function AdminVisibilityPage() {
  const user = await requireAdmin();
  const settings = await getSettings();
  const hidden = new Set(settings.comingSoon || []);

  return (
    <DashShell title="Page visibility" user={user}>
      <p className="body">
        Ticked pages show a &ldquo;Coming soon&rdquo; message to visitors instead of their content. Untick a page to
        put it live. Everything you edit under Page copy, Events, Writings and so on is kept and appears as soon as
        the page goes live.
      </p>
      <ActionForm action={saveVisibilityAction} className="form dash-form">
        <fieldset className="dash-fieldset">
          <legend className="dash-label">Show &ldquo;Coming soon&rdquo; on</legend>
          {GATED_PAGES.map((page) => (
            <label className="dash-check" key={page.key}>
              <input type="checkbox" name="comingSoon" value={page.key} defaultChecked={hidden.has(page.key)} />
              {page.label}
              <Link className="dash-link" href={page.href} target="_blank">
                {page.href}
              </Link>
            </label>
          ))}
        </fieldset>
        <label>
          Coming soon heading
          <input name="comingSoonTitle" defaultValue={settings.comingSoonTitle} />
        </label>
        <label>
          Coming soon message
          <textarea name="comingSoonLede" defaultValue={settings.comingSoonLede} />
        </label>
        <button className="btn btn-outline" type="submit">
          Save visibility
        </button>
      </ActionForm>
    </DashShell>
  );
}
