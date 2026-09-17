'use client';

import { useState } from 'react';
import { updateBusinessPlanField } from '@/app/actions';

type PlanField = 'current_state' | 'vision' | 'focus_areas' | 'action_steps' | 'obstacles';

export type BusinessPlan = Partial<Record<PlanField, string | null>>;

const SECTIONS: { field: PlanField; label: string; placeholder: string }[] = [
  {
    field: 'current_state',
    label: 'Where the business stands today',
    placeholder: 'What does the business do, and where is it right now?',
  },
  {
    field: 'vision',
    label: 'Where you want it to go',
    placeholder: 'What do you want the business to look like in 1–3 years?',
  },
  {
    field: 'focus_areas',
    label: "What you're focusing on",
    placeholder: 'e.g. Sales & marketing, Team, Cash flow',
  },
  {
    field: 'action_steps',
    label: 'Next steps',
    placeholder: "What needs to happen next, and who's doing it?",
  },
  {
    field: 'obstacles',
    label: 'What might get in the way',
    placeholder: "What's likely to slow you down, and what support would help?",
  },
];

export default function BusinessPlanForm({ plan }: { plan: BusinessPlan }) {
  return (
    <div className="space-y-3">
      {SECTIONS.map((s) => (
        <PlanSection
          key={s.field}
          field={s.field}
          label={s.label}
          placeholder={s.placeholder}
          value={plan[s.field] ?? ''}
        />
      ))}
    </div>
  );
}

function PlanSection({
  field,
  label,
  placeholder,
  value,
}: {
  field: PlanField;
  label: string;
  placeholder: string;
  value: string;
}) {
  const [content, setContent] = useState(value);
  const [editing, setEditing] = useState(!value);
  const [saving, setSaving] = useState(false);

  async function save() {
    const formData = new FormData();
    formData.set('field', field);
    formData.set('value', content);
    setSaving(true);
    await updateBusinessPlanField(formData);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="card">
      <p className="label text-xs mb-2">{label}</p>

      {editing ? (
        <div className="space-y-2">
          <textarea
            className="input"
            rows={4}
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="button" onClick={save} className="btn-primary text-sm" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            {value && (
              <button
                type="button"
                className="btn-secondary text-sm"
                onClick={() => {
                  setContent(value);
                  setEditing(false);
                }}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-gray-700 text-sm whitespace-pre-wrap flex-1">{value}</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-brand-600 hover:underline whitespace-nowrap"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
