import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import MediaField from "@/components/admin/MediaField";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { User } from "@/models/User";
import { addPortfolioAction, removePortfolioAction } from "@/server/actions/profile";
import { requireStaff } from "@/server/dal";

export const metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const session = await requireStaff();
  await connectDb();
  const user = toPlain(await User.findById(session._id).lean());

  return (
    <DashShell title="Portfolio" user={user} nav="me">
      <ActionForm action={addPortfolioAction} className="form dash-form" successText="Piece added.">
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Kind
          <select name="kind" defaultValue="writing">
            <option value="writing">Writing</option>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Body
          <textarea name="body" />
        </label>
        <MediaField name="mediaUrl" label="Attached media" accept="image/*,video/mp4,application/pdf" />
        <button className="btn btn-outline" type="submit">
          Add piece
        </button>
      </ActionForm>
      <div className="dash-list">
        {(user.portfolio || []).map((piece) => (
          <article className="dash-item" key={piece._id}>
            <strong>{piece.title}</strong>
            <span>{piece.kind}</span>
            <p className="body">{piece.body}</p>
            <form action={removePortfolioAction}>
              <input type="hidden" name="id" value={piece._id} />
              <button className="dash-mini" type="submit">
                Remove
              </button>
            </form>
          </article>
        ))}
      </div>
    </DashShell>
  );
}
