'use client';

import { useState } from 'react';
import { saveTarget } from '@/app/actions';

export default function AddTargetForm({ defaultMonth }: { defaultMonth: string }) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!adding) {
    return (
      <button type="button" onClick={() => setAdding(true)} className="btn-secondary text-sm">
        + Add a target
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        setSaving(true);
        await saveTarget(formData);
        setSaving(false);
        setAdding(false);
      }}
      className="card space-y-3"
    >
      <div>
        <label className="label text-xs">Month</label>
        <input name="period_month" type="month" defaultValue={defaultMonth} required className="input" />
      </div>
      <input name="title" required placeholder="e.g. Sign 3 new clients" className="input" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-xs">Target value (optional)</label>
          <input name="target_value" type="number" step="any" className="input" />
        </div>
        <div>
          <label className="label text-xs">Unit (optional)</label>
          <input name="target_unit" placeholder="e.g. £, clients" className="input" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary text-sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save target'}
        </button>
        <button type="button" className="btn-secondary text-sm" onClick={() => setAdding(false)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
