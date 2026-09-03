import { notFound } from "next/navigation";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import JsonRows from "@/components/admin/JsonRows";
import { PAGE_KEYS } from "@/config/constants";
import { savePageAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";
import { getPage } from "@/server/queries/public";

export default async function AdminPageEditor({ params }) {
  const user = await requireAdmin();
  const { key } = await params;
  if (!PAGE_KEYS.includes(key)) notFound();
  const page = await getPage(key);

  return (
    <DashShell title={`Edit /${key}`} user={user}>
      <ActionForm action={savePageAction} className="form dash-form">
        <input type="hidden" name="key" value={key} />
        <label>
          Title
          <input name="title" defaultValue={page.title} />
        </label>
        <label>
          Lede
          <textarea name="lede" defaultValue={page.lede} />
        </label>
        <label>
          Eyebrow
          <input name="eyebrow" defaultValue={page.eyebrow} />
        </label>
        <label>
          Headline
          <input name="headline" defaultValue={page.headline} />
        </label>
        <label>
          Secondary headline
          <input name="secondaryHeadline" defaultValue={page.secondaryHeadline} />
        </label>
        <label>
          Secondary lede
          <textarea name="secondaryLede" defaultValue={page.secondaryLede} />
        </label>
        <label>
          Body
          <textarea name="body" defaultValue={page.body} rows={8} />
        </label>
        <MediaField name="heroImage" label="Hero / banner image" defaultValue={page.heroImage} />
        <MediaField name="calligraphyImage" label="Calligraphy" defaultValue={page.calligraphyImage} />
        <label>
          CTA label
          <input name="ctaLabel" defaultValue={page.ctaLabel} />
        </label>
        <label>
          CTA link
          <input name="ctaHref" defaultValue={page.ctaHref} />
        </label>
        <JsonRows
          name="statsJson"
          label="Stats"
          fields={[
            { key: "value", label: "Value" },
            { key: "label", label: "Label" },
          ]}
          defaultRows={page.stats || []}
        />
        <JsonRows
          name="cardsJson"
          label="Cards"
          fields={[
            { key: "title", label: "Title" },
            { key: "body", label: "Body" },
            { key: "image", label: "Image URL" },
          ]}
          defaultRows={page.cards || []}
        />
        <button className="btn btn-outline" type="submit">
          Save page
        </button>
      </ActionForm>
    </DashShell>
  );
}
