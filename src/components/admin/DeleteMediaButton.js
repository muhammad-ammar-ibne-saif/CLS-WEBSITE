"use client";

import ActionForm from "./ActionForm";
import { deleteMediaAction } from "@/server/actions/media";

export default function DeleteMediaButton({ id }) {
  function confirmDelete(event) {
    if (!window.confirm("Delete this file? Pages using it will show an empty frame.")) event.preventDefault();
  }

  return (
    <ActionForm action={deleteMediaAction} className="dash-actions" successText="">
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="dash-mini" onClick={confirmDelete}>
        Delete
      </button>
    </ActionForm>
  );
}
