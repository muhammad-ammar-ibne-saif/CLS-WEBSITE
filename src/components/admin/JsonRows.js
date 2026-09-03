"use client";

import { useMemo, useState } from "react";

export default function JsonRows({ name, label, fields, defaultRows = [] }) {
  const [rows, setRows] = useState(defaultRows.length ? defaultRows : [{}]);

  const json = useMemo(() => JSON.stringify(rows), [rows]);

  function update(index, key, value) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  return (
    <div className="dash-rows">
      <p className="dash-label">{label}</p>
      <input type="hidden" name={name} value={json} />
      {rows.map((row, index) => (
        <div className="dash-row" key={index}>
          {fields.map((field) => (
            <input
              key={field.key}
              value={row[field.key] || ""}
              placeholder={field.label}
              onChange={(event) => update(index, field.key, event.target.value)}
            />
          ))}
          <button type="button" className="dash-mini" onClick={() => setRows((current) => current.filter((_, i) => i !== index))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => setRows((current) => [...current, {}])}>
        Add
      </button>
    </div>
  );
}
