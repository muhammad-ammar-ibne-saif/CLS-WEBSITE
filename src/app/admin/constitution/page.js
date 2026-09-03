import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Constitution } from "@/models/Constitution";
import { deleteConstitutionAction, saveConstitutionAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Constitution" };

export default async function AdminConstitutionPage({ searchParams }) {
  const user = await requireAdmin();
  const { id } = await searchParams;
  await connectDb();
  const items = (await Constitution.find().sort({ order: 1 }).lean()).map(toPlain);
  const current = items.find((item) => item._id === id) || null;

  return (
    <DashShell title="Constitution documents" user={user}>
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/admin/constitution">
            New document
          </Link>
          {items.map((item) => (
            <Link className="dash-item" key={item._id} href={`/admin/constitution?id=${item._id}`}>
              <strong>{item.title}</strong>
              <span>{item.credit}</span>
            </Link>
          ))}
        </div>
        <ActionForm action={saveConstitutionAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Title
            <input name="title" defaultValue={current?.title} required />
          </label>
          <label>
            Year
            <input name="year" defaultValue={current?.year} />
          </label>
          <label>
            Credit
            <input name="credit" defaultValue={current?.credit} />
          </label>
          <MediaField name="file" label="File / thumbnail" defaultValue={current?.file} accept="image/*,.pdf" />
          <label>
            Order
            <input name="order" type="number" defaultValue={current?.order ?? 0} />
          </label>
          <button className="btn btn-outline" type="submit">
            Save
          </button>
        </ActionForm>
        {current ? (
          <form action={deleteConstitutionAction}>
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
