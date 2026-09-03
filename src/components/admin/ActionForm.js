"use client";

import { useActionState } from "react";

export default function ActionForm({ action, children, className, successText = "Saved." }) {
  const [state, formAction, pending] = useActionState(async (_prev, formData) => action(formData), null);

  return (
    <form action={formAction} className={className}>
      {state?.error ? <p className="dash-error">{state.error}</p> : null}
      {state?.ok ? <p className="dash-ok">{successText}</p> : null}
      {children}
      {pending ? <p className="dash-hint">Working…</p> : null}
    </form>
  );
}
