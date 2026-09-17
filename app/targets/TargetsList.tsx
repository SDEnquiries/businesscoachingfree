'use client';

import { useState } from 'react';
import { saveTarget, deleteTarget } from '@/app/actions';
import DeleteButton from '@/components/DeleteButton';

export type TargetRow = {
  id: string;
  period_month: string; // 'YYYY-MM-01'
  title: string;
  target_value: number | null;
  target_unit: string | null;
  actual_value: number | null;
  status: 'not_started' | 'in_progress' | 'achieved' | 'missed';
};

const STATUS_LABEL: Record<TargetRow['status'], string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  achieved: 'Achieved',
  missed: 'Missed',
};

const STATUS_STYLE: Record<TargetRow['status'], string> = {
  not_started: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-orange-100 text-orange-700',
  achieved: 'bg-[#eaf6d9] text-[#5b8a1f]',
  missed: 'bg-red-100 text-red-600',
};

function monthLabel(periodMonth: string) {
  const d = new Date(`${periodMonth}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function monthInputValue(periodMonth: string) {
  return periodMonth.slice(0, 7); // 'YYYY-MM'
}

export default function TargetsList({ targets }: { targets: TargetRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleSave(formData: FormData, id: string) {
    setSavingId(id);
    await saveTarget(formData);
    setSavingId(null);
    setEditingId(null);
  }

  if (targets.length === 0) {
    return <p className="page-subtext">No targets yet — add your first one below.</p>;
  }

  return (
    <div className="grid gap-3">
      {targets.map((t) => {
        const isEditing = editingId === t.id;
        const isSaving = savingId === t.id;

        return (
          <div key={t.id} className="card">
            {!isEditing ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-gray-400">{monthLabel(t.period_month)}</span>
                    <p className="font-medium mt-1">{t.title || 'Untitled target'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[t.status]}`}>
                    {STATUS_LABEL[t.status]}
                  </span>
                </div>

                {(t.target_value !== null || t.actual_value !== null) && (
                  <div className="mt-2 flex gap-4 text-sm text-gray-700">
                    {t.target_value !== null && (
                      <span>
                        Target: <span className="font-medium">{t.target_value}</span> {t.target_unit}
                      </span>
                    )}
                    {t.actual_value !== null && (
                      <span>
                        Actual: <span className="font-medium">{t.actual_value}</span> {t.target_unit}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(t.id)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    Edit
                  </button>
                  <DeleteButton
                    action={deleteTarget}
                    fields={{ id: t.id }}
                    confirmText="Remove this target?"
                  />
                </div>
              </>
            ) : (
              <form
                action={async (formData) => {
                  formData.set('id', t.id);
                  formData.set('period_month', monthInputValue(t.period_month));
                  await handleSave(formData, t.id);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-gray-400">{monthLabel(t.period_month)}</p>
                <input name="title" defaultValue={t.title} required placeholder="Target title" className="input" />
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label text-xs">Target value</label>
                    <input
                      name="target_value"
                      type="number"
                      step="any"
                      defaultValue={t.target_value ?? ''}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Unit</label>
                    <input
                      name="target_unit"
                      defaultValue={t.target_unit ?? ''}
                      placeholder="e.g. £, clients"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Actual so far</label>
                    <input
                      name="actual_value"
                      type="number"
                      step="any"
                      defaultValue={t.actual_value ?? ''}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="label text-xs">Status</label>
                  <select name="status" defaultValue={t.status} className="input">
                    <option value="not_started">Not started</option>
                    <option value="in_progress">In progress</option>
                    <option value="achieved">Achieved</option>
                    <option value="missed">Missed</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary text-sm" disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>
                  <button type="button" className="btn-secondary text-sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
