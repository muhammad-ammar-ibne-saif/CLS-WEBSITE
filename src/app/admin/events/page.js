import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Event } from "@/models/Event";
import { deleteEventAction, saveEventAction } from "@/server/actions/cms";
import { requireAdmin } from "@/server/dal";

export const metadata = { title: "Events" };

export default async function AdminEventsPage({ searchParams }) {
  const user = await requireAdmin();
  const { id } = await searchParams;
  await connectDb();
  const events = (await Event.find().sort({ order: 1, createdAt: -1 }).lean()).map(toPlain);
  const current = events.find((item) => item._id === id) || null;

  return (
    <DashShell title="Events" user={user}>
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/admin/events">
            New event
          </Link>
          {events.map((item) => (
            <Link className="dash-item" key={item._id} href={`/admin/events?id=${item._id}`}>
              <strong>{item.title}</strong>
              <span>{item.year} · {item.published ? "Live" : "Hidden"}</span>
            </Link>
          ))}
        </div>
        <ActionForm action={saveEventAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Title
            <input name="title" defaultValue={current?.title} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={current?.slug} placeholder="auto from title" />
          </label>
          <label>
            Year
            <input name="year" defaultValue={current?.year} />
          </label>
          <label>
            Location
            <input name="location" defaultValue={current?.location} />
          </label>
          <label>
            Starts
            <input type="datetime-local" name="startsAt" defaultValue={current?.startsAt?.slice?.(0, 16)} />
          </label>
          <MediaField name="image" label="Cover" defaultValue={current?.image} />
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
            Save event
          </button>
        </ActionForm>
        {current ? (
          <form action={deleteEventAction}>
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
