"use client";

import { useContext } from "react";
import { PendingContext } from "./PendingContext";

export default function SubmitButton({ children, pendingText = "Working", className = "btn btn-outline", ...rest }) {
  const pending = useContext(PendingContext);
  return (
    <button className={className} type="submit" disabled={pending} {...rest}>
      {pending ? pendingText : children}
    </button>
  );
}
