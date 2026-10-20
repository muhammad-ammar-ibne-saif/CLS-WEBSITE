"use client";

import { useMemo, useState } from "react";
import { uploadFile } from "./upload";

export default function JsonRows({ name, label, fields, defaultRows = [] }) {
  const [state, setState] = useState({
    rows: defaultRows.length ? defaultRows : [{}],
    busy: -1,
    error: "",
  });
  const json = useMemo(() => JSON.stringify(state.rows), [state.rows]);

  function setRows(update) {
    setState((current) => ({ ...current, rows: update(current.rows) }));
  }

  function change(index, key, value) {
    setRows((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  async function upload(index, key, file) {
    if (!file) return;
    setState((current) => ({ ...current, busy: index, error: "" }));
    try {
      const data = await uploadFile(file);
      setState((current) => ({
        ...current,
        busy: -1,
        rows: current.rows.map((row, i) => (i === index ? { ...row, [key]: data.url } : row)),
      }));
    } catch (error) {
      setState((current) => ({ ...current, busy: -1, error: error.message }));
    }
  }

  return (
    <div className="dash-rows">
      <p className="dash-label">{label}</p>
      <input type="hidden" name={name} value={json} />
      {state.error ? (
        <p className="dash-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.rows.map((row, index) => (
        <div className="dash-row" key={index}>
          {fields.map((field) =>
            field.media ? (
              <div className="media-tools" key={field.key}>
                <input
                  value={row[field.key] || ""}
                  placeholder={field.label}
                  onChange={(event) => change(index, field.key, event.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  disabled={state.busy === index}
                  onChange={(event) => {
                    upload(index, field.key, event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                {row[field.key] ? <img className="dash-thumb" src={row[field.key]} alt="" loading="lazy" decoding="async" /> : null}
              </div>
            ) : (
              <input
                key={field.key}
                value={row[field.key] || ""}
                placeholder={field.label}
                onChange={(event) => change(index, field.key, event.target.value)}
              />
            ),
          )}
          <button type="button" className="dash-mini" onClick={() => setRows((rows) => rows.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => setRows((rows) => [...rows, {}])}>
        Add
      </button>
    </div>
  );
}
