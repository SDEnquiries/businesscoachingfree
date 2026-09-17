import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import BusinessPlanForm from './BusinessPlanForm';

export default async function PlanPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: plan } = await supabase
    .from('business_plan')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen">
      <NavBar name={profile?.full_name ?? ''} />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold page-heading">Your business plan</h1>
          <p className="page-subtext text-sm mt-1">
            Five simple sections to get your thinking straight — come back and update it anytime.
          </p>
        </div>
        <BusinessPlanForm plan={plan ?? {}} />
      </div>
    </main>
  );
}
