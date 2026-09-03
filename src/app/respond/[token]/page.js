import ActionForm from "@/components/admin/ActionForm";
import { connectDb } from "@/lib/db";
import { toPlain } from "@/lib/utils";
import { Assignment } from "@/models/Assignment";
import { respondAssignmentAction } from "@/server/actions/plans";
import { notFound } from "next/navigation";

export const metadata = { title: "Respond" };

export default async function RespondPage({ params }) {
  const { token } = await params;
  await connectDb();
  const assignment = toPlain(await Assignment.findOne({ token }).populate("plan").lean());
  if (!assignment) notFound();
  const item = assignment.plan?.items?.find((entry) => String(entry._id) === String(assignment.itemId));

  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <p className="eyebrow">CLS CALENDAR</p>
        <h1 className="headline">{item?.title || "Invitation"}</h1>
        <p className="body">{assignment.plan?.title}</p>
        <p className="body">{item?.description}</p>
        {assignment.status !== "pending" ? (
          <p className="dash-ok">You already responded: {assignment.status}.</p>
        ) : null}
        <ActionForm action={respondAssignmentAction} className="form" successText="Response recorded. Thank you.">
          <input type="hidden" name="token" value={token} />
          <label>
            Your answer
            <select name="status" defaultValue="accepted">
              <option value="accepted">Accept</option>
              <option value="maybe">Maybe</option>
              <option value="declined">Decline</option>
            </select>
          </label>
          <label>
            Note
            <textarea name="note" />
          </label>
          <button className="btn btn-outline" type="submit">
            Send
          </button>
        </ActionForm>
      </div>
    </main>
  );
}
