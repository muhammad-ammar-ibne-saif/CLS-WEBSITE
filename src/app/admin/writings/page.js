import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import JsonRows from "@/components/admin/JsonRows";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Writing } from "@/models/Writing";
import { deleteWritingAction, saveWritingAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Writings" };

export default async function AdminWritingsPage({ searchParams }) {
  const user = await requireAdmin();
  const { id } = await searchParams;
  await connectDb();
  const writings = (await Writing.find().sort({ order: 1 }).lean()).map(toPlain);
  const current = writings.find((item) => item._id === id) || null;

  return (
    <DashShell title="Writings" user={user}>
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/admin/writings">
            New writer
          </Link>
          {writings.map((item) => (
            <Link className="dash-item" key={item._id} href={`/admin/writings?id=${item._id}`}>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </Link>
          ))}
        </div>
        <ActionForm action={saveWritingAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Name
            <input name="name" defaultValue={current?.name} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={current?.slug} />
          </label>
          <label>
            Role
            <input name="role" defaultValue={current?.role} />
          </label>
          <MediaField name="image" label="Portrait" defaultValue={current?.image} />
          <label>
            Bio
            <textarea name="bio" defaultValue={current?.bio} />
          </label>
          <JsonRows
            name="piecesJson"
            label="Pieces"
            fields={[
              { key: "title", label: "Title" },
              { key: "body", label: "Body" },
            ]}
            defaultRows={current?.pieces || []}
          />
          <label>
            Order
            <input name="order" type="number" defaultValue={current?.order ?? 0} />
          </label>
          <label className="dash-check">
            <input name="published" type="checkbox" defaultChecked={current?.published !== false} />
            Published
          </label>
          <button className="btn btn-outline" type="submit">
            Save writer
          </button>
        </ActionForm>
        {current ? (
          <form action={deleteWritingAction}>
            <input type="hidden" name="id" value={current._id} />
            <button className="dash-mini" type="submit">
              Delete
            </button>
          </form>
        ) : null}
      </div>
    </DashShell>
  );
}
