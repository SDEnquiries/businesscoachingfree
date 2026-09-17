import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import TargetsList, { type TargetRow } from './TargetsList';
import AddTargetForm from './AddTargetForm';

function toMonthInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default async function TargetsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  const { data: targets } = await supabase
    .from('targets')
    .select('*')
    .eq('user_id', user.id)
    .order('period_month', { ascending: true });

  const rows = (targets ?? []) as TargetRow[];
  const lastMonth = rows[rows.length - 1]?.period_month;
  const nextMonthDate = lastMonth ? new Date(`${lastMonth}T00:00:00`) : new Date();
  if (lastMonth) nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  const defaultMonth = toMonthInput(nextMonthDate);
  const achievedCount = rows.filter((t) => t.status === 'achieved').length;

  return (
    <main className="min-h-screen">
      <NavBar name={profile?.full_name ?? ''} />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold page-heading">Your targets</h1>
          <p className="page-subtext text-sm mt-1">
            {rows.length > 0
              ? `${rows.length} target${rows.length === 1 ? '' : 's'} set, ${achievedCount} achieved.`
              : 'Set a few simple monthly targets to track progress against.'}
          </p>
        </div>

        <TargetsList targets={rows} />

        <AddTargetForm defaultMonth={defaultMonth} />
      </div>
    </main>
  );
}
