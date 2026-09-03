import Link from "next/link";
import DashShell from "@/components/admin/DashShell";
import ActionForm from "@/components/admin/ActionForm";
import PlanEditor from "@/components/admin/PlanEditor";
import { DEPARTMENTS } from "@/config/constants";
import { connectDb } from "@/lib/db";
import { currentSemester, toPlain } from "@/lib/utils";
import { Assignment } from "@/models/Assignment";
import { SemesterPlan } from "@/models/SemesterPlan";
import { User } from "@/models/User";
import { deletePlanAction, publishPlanAction, savePlanAction } from "@/server/actions/plans";
import { requireEc } from "@/server/dal";

export const metadata = { title: "Semester plan" };

export default async function EcPlanPage({ searchParams }) {
  const user = await requireEc();
  const { id } = await searchParams;
  await connectDb();
  const plans = (await SemesterPlan.find().sort({ createdAt: -1 }).lean()).map(toPlain);
  const current = plans.find((plan) => plan._id === id) || null;
  const directors = (
    await User.find({ status: "approved", $or: [{ isDirector: true }, { office: /director/i }] })
      .select("name office department")
      .lean()
  ).map(toPlain);
  const responses = current
    ? (await Assignment.find({ plan: current._id }).populate("user", "name office email").lean()).map(toPlain)
    : [];

  return (
    <DashShell title="Executive Council calendar" user={user} nav="ec">
      <div className="dash-split">
        <div className="dash-list">
          <Link className="btn" href="/ec">
            New plan
          </Link>
          {plans.map((plan) => (
            <Link className="dash-item" key={plan._id} href={`/ec?id=${plan._id}`}>
              <strong>{plan.title}</strong>
              <span>
                {plan.semester} · {plan.status}
              </span>
            </Link>
          ))}
        </div>
        <ActionForm action={savePlanAction} className="form dash-form">
          {current ? <input type="hidden" name="id" value={current._id} /> : null}
          <label>
            Title
            <input name="title" defaultValue={current?.title} required placeholder="Fall literary calendar" />
          </label>
          <label>
            Semester
            <input name="semester" defaultValue={current?.semester || currentSemester()} required />
          </label>
          <label>
            Overview
            <textarea name="overview" defaultValue={current?.overview} />
          </label>
          <PlanEditor departments={DEPARTMENTS} directors={directors} defaultPlan={current} />
          <button className="btn btn-outline" type="submit">
            Save draft
          </button>
        </ActionForm>
        {current ? (
          <div className="dash-actions">
            <form action={publishPlanAction}>
              <input type="hidden" name="id" value={current._id} />
              <button className="btn" type="submit">
                Publish & email directors
              </button>
            </form>
            <form action={deletePlanAction}>
              <input type="hidden" name="id" value={current._id} />
              <button className="dash-mini" type="submit">
                Delete
              </button>
            </form>
          </div>
        ) : null}
        {responses.length ? (
          <div className="dash-list">
            <h2 className="dash-h2">Director responses</h2>
            {responses.map((row) => (
              <article className="dash-item" key={row._id}>
                <strong>{row.user?.name || row.email}</strong>
                <span>
                  {row.status} · {row.note || "no note"}
                </span>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </DashShell>
  );
}
