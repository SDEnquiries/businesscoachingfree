'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const PLAN_FIELDS = ['current_state', 'vision', 'focus_areas', 'action_steps', 'obstacles'] as const;
type PlanField = (typeof PLAN_FIELDS)[number];

export async function updateBusinessPlanField(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const field = formData.get('field') as PlanField;
  if (!PLAN_FIELDS.includes(field)) return;
  const value = (formData.get('value') as string) ?? '';

  await supabase.from('business_plan').upsert(
    { user_id: user.id, [field]: value, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );

  revalidatePath('/plan');
  revalidatePath('/dashboard');
}

export async function saveTarget(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get('id') as string | null;
  const periodMonth = formData.get('period_month') as string; // 'YYYY-MM'
  const targetValueRaw = formData.get('target_value') as string;
  const actualValueRaw = formData.get('actual_value') as string;

  const payload = {
    user_id: user.id,
    period_month: `${periodMonth}-01`,
    title: formData.get('title') as string,
    target_value: targetValueRaw ? Number(targetValueRaw) : null,
    target_unit: (formData.get('target_unit') as string) || null,
    actual_value: actualValueRaw ? Number(actualValueRaw) : null,
    status: (formData.get('status') as string) || 'not_started',
  };

  if (id) {
    await supabase.from('targets').update(payload).eq('id', id).eq('user_id', user.id);
  } else {
    await supabase.from('targets').insert(payload);
  }

  revalidatePath('/targets');
  revalidatePath('/dashboard');
}

export async function deleteTarget(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get('id') as string;
  await supabase.from('targets').delete().eq('id', id).eq('user_id', user.id);

  revalidatePath('/targets');
  revalidatePath('/dashboard');
}
