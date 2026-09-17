import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-brand-500">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <Logo size={72} textSize="lg" align="center" light />
        </div>
        <p className="text-gold-light text-xs font-semibold tracking-wider uppercase mb-3">
          Free business planning toolkit
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Get your plan on paper. Get your targets set.
        </h1>
        <p className="text-white/80 mb-8">
          A free, simple tool to sketch out your business plan and set a few monthly targets —
          no spreadsheet, no fuss. Come back and update it anytime.
        </p>
        <div className="flex gap-3 justify-center mb-14">
          <Link href="/login" className="btn-primary">
            Log in
          </Link>
          <Link href="/signup" className="btn-outline-light">
            Create a free account
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <div className="card">
            <p className="font-medium mb-1">📝 Business plan</p>
            <p className="text-sm text-gray-500">
              Five simple sections — current state, vision, focus areas, next steps, and
              obstacles.
            </p>
          </div>
          <div className="card">
            <p className="font-medium mb-1">🎯 Monthly targets</p>
            <p className="text-sm text-gray-500">
              Set a few simple targets each month and track how you&apos;re doing against them.
            </p>
          </div>
        </div>
        <p className="text-white/50 text-xs mt-14">
          A free tool from Business Coaching Accelerator, powered by Switch Direction.
        </p>
      </div>
    </main>
  );
}
