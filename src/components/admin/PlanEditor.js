"use client";

import { useMemo, useState } from "react";
import { ITEM_KINDS } from "@/config/constants";

function emptyItem() {
  return {
    kind: "event",
    title: "",
    description: "",
    location: "",
    startsAt: "",
    departments: [],
  };
}

export default function PlanEditor({ departments = [], directors = [], defaultPlan }) {
  const [items, setItems] = useState(defaultPlan?.items?.length ? defaultPlan.items : [emptyItem()]);

  const json = useMemo(
    () =>
      JSON.stringify(
        items.map((item) => ({
          ...item,
          departments: item.departments || [],
          directorIds: item.directorIds || [],
        })),
      ),
    [items],
  );

  function update(index, patch) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <>
      <input type="hidden" name="itemsJson" value={json} />
      {items.map((item, index) => (
        <fieldset className="dash-item-block" key={index}>
          <legend>
            {item.kind} {index + 1}
          </legend>
          <label>
            Kind
            <select value={item.kind} onChange={(e) => update(index, { kind: e.target.value })}>
              {ITEM_KINDS.map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input value={item.title} onChange={(e) => update(index, { title: e.target.value })} />
          </label>
          <label>
            Location
            <input value={item.location || ""} onChange={(e) => update(index, { location: e.target.value })} />
          </label>
          <label>
            Starts
            <input
              type="datetime-local"
              value={item.startsAt ? String(item.startsAt).slice(0, 16) : ""}
              onChange={(e) => update(index, { startsAt: e.target.value })}
            />
          </label>
          <label>
            Description
            <textarea value={item.description || ""} onChange={(e) => update(index, { description: e.target.value })} />
          </label>
          <label>
            Notify departments
            <select
              multiple
              value={item.departments || []}
              onChange={(e) =>
                update(index, {
                  departments: Array.from(e.target.selectedOptions).map((option) => option.value),
                })
              }
            >
              {departments.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </label>
          <label>
            Notify directors
            <select
              multiple
              value={(item.directorIds || []).map(String)}
              onChange={(e) =>
                update(index, {
                  directorIds: Array.from(e.target.selectedOptions).map((option) => option.value),
                })
              }
            >
              {directors.map((person) => (
                <option key={person._id} value={person._id}>
                  {person.name} · {person.office}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="dash-mini" onClick={() => setItems((current) => current.filter((_, i) => i !== index))}>
            Remove item
          </button>
        </fieldset>
      ))}
      <button type="button" className="btn" onClick={() => setItems((current) => [...current, emptyItem()])}>
        Add meeting / event
      </button>
    </>
  );
}
