import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { User } from "@/models/User";
import { addMemoryAction, removeMemoryAction } from "@/server/actions/profile";
import { requireStaff } from "@/server/dal";

export const metadata = { title: "Memories" };

export default async function MemoriesPage() {
  const session = await requireStaff();
  await connectDb();
  const user = toPlain(await User.findById(session._id).lean());

  return (
    <DashShell title="Memories" user={user} nav="me">
      <ActionForm action={addMemoryAction} className="form dash-form" successText="Memory added.">
        <MediaField name="image" label="Photograph" />
        <label>
          Caption
          <input name="caption" />
        </label>
        <label>
          Event
          <input name="event" placeholder="Shaam e Sukhan 2025" />
        </label>
        <label>
          Date
          <input type="date" name="takenAt" />
        </label>
        <button className="btn btn-outline" type="submit">
          Add memory
        </button>
      </ActionForm>
      <div className="dash-cards">
        {(user.memories || []).map((memory) => (
          <article className="dash-card" key={memory._id}>
            <img src={memory.image} alt="" />
            <div>
              <h3>{memory.event || "Memory"}</h3>
              <p className="body">{memory.caption}</p>
              <form action={removeMemoryAction}>
                <input type="hidden" name="id" value={memory._id} />
                <button className="dash-mini" type="submit">
                  Remove
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </DashShell>
  );
}
