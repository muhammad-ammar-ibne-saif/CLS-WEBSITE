"use client";

export default function AdminError({ error, reset }) {
  return (
    <main className="dash-auth">
      <div className="dash-auth-card">
        <h1 className="headline">The desk could not load</h1>
        <p className="body">{error.message}</p>
        <p className="body">If MongoDB is not running, start it and open /api/setup once.</p>
        <button className="btn" type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
