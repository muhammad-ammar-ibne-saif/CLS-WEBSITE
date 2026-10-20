"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { PendingContext } from "./PendingContext";

export default function ActionForm({
  action,
  children,
  className,
  successText = "Saved.",
  successView = null,
  resetOnSuccess = false,
}) {
  const formRef = useRef(null);
  const [state, run, pending] = useActionState(async (_prev, formData) => action(formData), null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  function onSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget, event.nativeEvent.submitter);
    startTransition(() => run(data));
  }

  if (state?.ok && successView) return successView;

  return (
    <PendingContext.Provider value={pending}>
      <form ref={formRef} onSubmit={onSubmit} className={className}>
        {state?.error ? (
          <p className="dash-error" role="alert">
            {state.error}
          </p>
        ) : null}
        {state?.ok && successText ? (
          <p className="dash-ok" role="status">
            {successText}
          </p>
        ) : null}
        {children}
        {pending ? <p className="dash-hint">Working…</p> : null}
      </form>
    </PendingContext.Provider>
  );
}
