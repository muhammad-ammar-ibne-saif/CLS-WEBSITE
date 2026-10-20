"use client";

import { useState } from "react";
import ActionForm from "@/components/admin/ActionForm";
import SubmitButton from "@/components/admin/SubmitButton";
import { DEPARTMENTS, EC_RANK_LABELS, EC_RANK_ORDER, TEAMS } from "@/config/constants";
import { applyStaffAction } from "@/server/actions/auth";

export default function StaffApplyForm({ semester }) {
  const [team, setTeam] = useState(TEAMS.EC);

  return (
    <ActionForm action={applyStaffAction} className="form" successText="Request received.">
      <input className="hp-field" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label>
        Full name
        <input name="name" required maxLength={80} autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required maxLength={160} autoComplete="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" />
      </label>
      <label>
        Team
        <select name="team" required value={team} onChange={(event) => setTeam(event.target.value)}>
          <option value={TEAMS.EC}>Executive Council</option>
          <option value={TEAMS.CORE}>Core team</option>
        </select>
      </label>
      {team === TEAMS.EC ? (
        <label>
          Executive Council position
          <select name="ecRank" required defaultValue="">
            <option value="" disabled>
              Choose Director, Lead or Co-Lead
            </option>
            {EC_RANK_ORDER.map((rank) => (
              <option key={rank} value={rank}>
                {EC_RANK_LABELS[rank]}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label>
        Department
        <select name="department" required defaultValue="">
          <option value="" disabled>
            Choose a department
          </option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>
      </label>
      <label>
        Title on the page
        <input name="office" maxLength={80} placeholder="Urdu Director, Design Lead, Media Co-Lead" />
      </label>
      <label>
        Semester
        <input name="semester" defaultValue={semester} maxLength={40} />
      </label>
      <label>
        Roll number
        <input name="rollNumber" maxLength={40} />
      </label>
      <label>
        A line about your role
        <textarea name="why" required minLength={8} maxLength={1200} />
      </label>
      <SubmitButton pendingText="Creating your desk">Create account and continue</SubmitButton>
    </ActionForm>
  );
}
