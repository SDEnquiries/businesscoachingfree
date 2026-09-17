'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData.user) {
      setError(signUpError?.message ?? 'Could not create account.');
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: signUpData.user.id,
      full_name: fullName,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-brand-500">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <Logo size={72} textSize="lg" align="center" />
        </div>
        <h1 className="text-xl font-semibold mb-1 text-center">Create your free account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Set up your business plan and targets in a couple of minutes.
        </p>

        <label className="label">Full name</label>
        <input
          className="input mb-4"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="label">Email</label>
        <input
          className="input mb-4"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          className="input mb-4"
          type="password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create free account'}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-600 font-medium">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
