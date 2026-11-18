import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import ConfirmButton from "@/components/admin/ConfirmButton";
import MediaField from "@/components/admin/MediaField";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Magazine } from "@/models/Magazine";
import { deleteMagazineAction, saveMagazineAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Magazine" };

function dateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default async function AdminMagazinesPage({ searchParams }) {
  const user = await requireAdmin();
  const { id } = await searchParams;
  await connectDb();
  const items = (await Magazine.find().sort({ order: 1, publishedOn: -1, createdAt: -1 }).lean()).map(toPlain);
  const current = items.find((item) => item._id === id) || null;

  return (
    <DashShell title="Magazine issues" user={user}>
      <p className="body">
        Upload an issue as a PDF (up to 150MB) and an optional cover image. Published issues appear at{" "}
        <Link href="/magazine">/magazine</Link>, where readers can flip through them in the browser or download them.
      </p>
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/admin/magazines">
            New issue
          </Link>
          {items.length === 0 ? <span className="dash-hint">No issues yet.</span> : null}
          {items.map((item) => (
            <Link className="dash-item" key={item._id} href={`/admin/magazines?id=${item._id}`}>
              <strong>{item.title}</strong>
              <span>
                {item.issue || "—"}
                {item.published ? "" : " · draft"}
              </span>
            </Link>
          ))}
        </div>
        <ActionForm key={current?._id || "new"} action={saveMagazineAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Title
            <input name="title" defaultValue={current?.title} placeholder="Qirtas — Fall 2026" required />
          </label>
          <label>
            Issue label
            <input name="issue" defaultValue={current?.issue} placeholder="Issue 01 · Fall 2026" />
          </label>
          <label>
            Slug (leave empty to generate)
            <input name="slug" defaultValue={current?.slug} />
          </label>
          <label>
            Short description
            <textarea name="summary" defaultValue={current?.summary} />
          </label>
          <MediaField library name="file" label="Magazine PDF" defaultValue={current?.file} accept="application/pdf" />
          <MediaField library name="cover" label="Cover image (optional — first page is used if empty)" defaultValue={current?.cover} />
          <label>
            Release date
            <input name="publishedOn" type="date" defaultValue={dateInput(current?.publishedOn)} />
          </label>
          <label>
            Order (lower shows first)
            <input name="order" type="number" defaultValue={current?.order ?? 0} />
          </label>
          <label className="dash-check">
            <input name="published" type="checkbox" defaultChecked={current?.published !== false} />
            Published
          </label>
          <button className="btn btn-outline" type="submit">
            Save issue
          </button>
          {current?.slug ? (
            <Link className="dash-link" href={`/magazine/${current.slug}`} target="_blank">
              Open reader ↗
            </Link>
          ) : null}
        </ActionForm>
        {current ? (
          <form action={deleteMagazineAction}>
            <input type="hidden" name="id" value={current._id} />
            <ConfirmButton className="dash-mini" message="Delete this issue? The PDF stays in the media library.">
              Delete
            </ConfirmButton>
          </form>
        ) : null}
      </div>
    </DashShell>
  );
}
