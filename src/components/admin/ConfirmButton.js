"use client";

export default function ConfirmButton({ message, children, ...rest }) {
  function onClick(event) {
    if (!window.confirm(message)) event.preventDefault();
  }
  return (
    <button type="submit" onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
