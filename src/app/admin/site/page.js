import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { saveSettingsAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";
import { getSettings } from "@/server/queries/public";

export const metadata = { title: "Site settings" };

export default async function AdminSitePage() {
  const user = await requireAdmin();
  const settings = await getSettings();

  return (
    <DashShell title="Site & join CTA" user={user}>
      <ActionForm action={saveSettingsAction} className="form dash-form">
        <label>
          Site name
          <input name="siteName" defaultValue={settings.siteName} required />
        </label>
        <label>
          Tagline
          <textarea name="tagline" defaultValue={settings.tagline} />
        </label>
        <MediaField library name="logo" label="Logo" defaultValue={settings.logo} />
        <MediaField
          library
          name="homeVideo"
          label="Home background video"
          defaultValue={settings.homeVideo}
          accept="video/mp4,video/webm"
        />
        <MediaField
          library
          name="homeShowcase"
          label="Home showcase frame (image or video)"
          defaultValue={settings.homeShowcase}
          accept="image/*,video/mp4,video/webm"
        />
        <MediaField library name="frameArt" label="Custom frame border (optional, portrait image)" defaultValue={settings.frameArt} />
        <MediaField library name="ctaCalligraphy" label="Join banner calligraphy" defaultValue={settings.ctaCalligraphy} />
        <MediaField library name="footerRose" label="Footer illustration" defaultValue={settings.footerRose} />
        <label>
          Current semester
          <input name="currentSemester" defaultValue={settings.currentSemester} />
        </label>
        <label>
          Join headline
          <input name="joinTitle" defaultValue={settings.joinTitle} />
        </label>
        <label>
          Join lede
          <textarea name="joinLede" defaultValue={settings.joinLede} />
        </label>
        <label>
          Join button
          <input name="joinCta" defaultValue={settings.joinCta} />
        </label>
        <label>
          Instagram
          <input name="instagram" defaultValue={settings.socials?.instagram} />
        </label>
        <label>
          Facebook
          <input name="facebook" defaultValue={settings.socials?.facebook} />
        </label>
        <label>
          TikTok
          <input name="tiktok" defaultValue={settings.socials?.tiktok} />
        </label>
        <label>
          Footer note
          <textarea name="footerNote" defaultValue={settings.footerNote} />
        </label>
        <button className="btn btn-outline" type="submit">
          Save site
        </button>
      </ActionForm>
    </DashShell>
  );
}
