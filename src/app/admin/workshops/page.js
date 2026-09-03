import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Workshop } from "@/models/Workshop";
import { deleteWorkshopAction, saveWorkshopAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Workshops" };

export default async function AdminWorkshopsPage({ searchParams }) {
  const user = await requireAdmin();
  const { id } = await searchParams;
  await connectDb();
  const workshops = (await Workshop.find().sort({ kind: 1, order: 1 }).lean()).map(toPlain);
  const current = workshops.find((item) => item._id === id) || null;

  return (
    <DashShell title="Workshops" user={user}>
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/admin/workshops">
            New workshop
          </Link>
          {workshops.map((item) => (
            <Link className="dash-item" key={item._id} href={`/admin/workshops?id=${item._id}`}>
              <strong>{item.title}</strong>
              <span>{item.kind}</span>
            </Link>
          ))}
        </div>
        <ActionForm action={saveWorkshopAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Title
            <input name="title" defaultValue={current?.title} required />
          </label>
          <label>
            Kind
            <select name="kind" defaultValue={current?.kind || "upcoming"}>
              <option value="upcoming">Upcoming</option>
              <option value="recording">Recording</option>
            </select>
          </label>
          <label>
            Instructor
            <input name="instructor" defaultValue={current?.instructor} />
          </label>
          <label>
            Location
            <input name="location" defaultValue={current?.location} />
          </label>
          <label>
            Starts
            <input type="datetime-local" name="startsAt" defaultValue={current?.startsAt?.slice?.(0, 16)} />
          </label>
          <label>
            Ends
            <input type="datetime-local" name="endsAt" defaultValue={current?.endsAt?.slice?.(0, 16)} />
          </label>
          <MediaField name="coverImage" label="Cover" defaultValue={current?.coverImage} />
          <label>
            Recording URL
            <input name="recordingUrl" defaultValue={current?.recordingUrl} />
          </label>
          <label>
            Materials URL
            <input name="materialsUrl" defaultValue={current?.materialsUrl} />
          </label>
          <label>
            Summary
            <textarea name="summary" defaultValue={current?.summary} />
          </label>
          <label>
            Body
            <textarea name="body" defaultValue={current?.body} />
          </label>
          <label>
            Order
            <input name="order" type="number" defaultValue={current?.order ?? 0} />
          </label>
          <label className="dash-check">
            <input name="published" type="checkbox" defaultChecked={current?.published !== false} />
            Published
          </label>
          <button className="btn btn-outline" type="submit">
            Save workshop
          </button>
        </ActionForm>
        {current ? (
          <form action={deleteWorkshopAction}>
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
