import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import JsonRows from "@/components/admin/JsonRows";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Tenure } from "@/models/Tenure";
import { deleteTenureAction, saveTenureAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "History" };

export default async function AdminHistoryPage({ searchParams }) {
  const user = await requireAdmin();
  const { id } = await searchParams;
  await connectDb();
  const tenures = (await Tenure.find().sort({ order: 1 }).lean()).map(toPlain);
  const current = tenures.find((item) => item._id === id) || null;

  return (
    <DashShell title="History tenures" user={user}>
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/admin/history">
            New tenure
          </Link>
          {tenures.map((item) => (
            <Link className="dash-item" key={item._id} href={`/admin/history?id=${item._id}`}>
              <strong>{item.title}</strong>
              <span>{item.president}</span>
            </Link>
          ))}
        </div>
        <ActionForm action={saveTenureAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Title
            <input name="title" defaultValue={current?.title} required />
          </label>
          <label>
            Year label
            <input name="yearLabel" defaultValue={current?.yearLabel} placeholder="2016" />
          </label>
          <label>
            President
            <input name="president" defaultValue={current?.president} required />
          </label>
          <MediaField name="portrait" label="Portrait" defaultValue={current?.portrait} />
          <label>
            Summary
            <textarea name="summary" defaultValue={current?.summary} />
          </label>
          <JsonRows
            name="eventsJson"
            label="Events of the year"
            fields={[
              { key: "name", label: "Name" },
              { key: "note", label: "Note" },
              { key: "image", label: "Image URL" },
            ]}
            defaultRows={current?.events || []}
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
            Save tenure
          </button>
        </ActionForm>
        {current ? (
          <form action={deleteTenureAction}>
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
