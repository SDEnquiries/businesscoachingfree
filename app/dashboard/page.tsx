import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';

const PLAN_FIELDS = ['current_state', 'vision', 'focus_areas', 'action_steps', 'obstacles'] as const;

export default async function DashboardPage() {
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
  const { data: targets } = await supabase.from('targets').select('status').eq('user_id', user.id);

  const filledSections = plan
    ? PLAN_FIELDS.filter((f) => (plan as Record<string, string | null>)[f]?.trim()).length
    : 0;
  const totalTargets = targets?.length ?? 0;
  const achievedTargets = targets?.filter((t) => t.status === 'achieved').length ?? 0;

  return (
    <main className="min-h-screen">
      <NavBar name={profile?.full_name ?? ''} />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold page-heading">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="page-subtext text-sm mt-1">
            A quick, free toolkit to get your business plan and targets down on paper.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-semibold text-brand-600">{filledSections}/5</p>
            <p className="text-xs text-gray-500 mt-1">Plan sections filled in</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-semibold text-brand-600">
              {totalTargets > 0 ? `${achievedTargets}/${totalTargets}` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Targets achieved</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/plan" className="card hover:shadow-md transition block">
            <p className="font-medium mb-1">📝 Business plan</p>
            <p className="text-sm text-gray-500">Get your thinking down in five simple sections</p>
          </Link>
          <Link href="/targets" className="card hover:shadow-md transition block">
            <p className="font-medium mb-1">🎯 Targets</p>
            <p className="text-sm text-gray-500">Set simple monthly targets and track progress</p>
          </Link>
        </div>

        <div className="card">
          <p className="font-medium mb-1">Want more?</p>
          <p className="text-sm text-gray-600">
            This free toolkit is a taste of the full Business Coaching Accelerator platform, where
            you work through a complete plan with a dedicated coach, get feedback on every
            section, and track progress together.{' '}
            <a
              href="https://businesscoachingaccelerator.co.uk"
              className="text-brand-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Find out more →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
