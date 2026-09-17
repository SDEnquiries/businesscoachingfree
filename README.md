# Business Plan & Targets Toolkit (free lite tool)

A small, standalone Next.js + Supabase app: a cut-down, free version of the
main Business Coaching Accelerator app. One role only (no coach/coachee
split, no teams, no resources, no session notes) — a business owner signs
up, fills in a simple 5-section business plan, and sets a few monthly
targets. Meant as a lead magnet / free resource that links back to the full
paid coaching platform from its dashboard.

## What's in it

- Public landing page, login, and free sign-up (email + password via
  Supabase Auth)
- Dashboard with two stats (plan sections filled in, targets achieved) and
  a "want more?" card linking to businesscoachingaccelerator.co.uk
- **Business plan**: 5 free-text sections — current state, vision, focus
  areas, next steps, obstacles. Self-edit only, no coach feedback (there's
  no coach in this app).
- **Targets**: add/edit/delete simple monthly targets (title, optional
  target value + unit, actual value, status). No pillar tagging or coach
  feedback — kept intentionally simpler than the full app's targets
  feature.

Same purple/gold visual theme as the main app for brand consistency.

## Setup

1. Create a **new, separate Supabase project** for this tool — it should
   not share a database with the main coaching app, since it has its own
   users and its own `profiles` / `business_plan` / `targets` tables.
2. In the Supabase SQL Editor, run `supabase/schema.sql` once.
3. Copy `.env.local.example` to `.env.local` and fill in your new project's
   URL and anon key (Settings -> API).
4. `npm install`
5. `npm run dev` to try it locally, or deploy to Vercel (or similar) same
   as the main app — set the two `NEXT_PUBLIC_SUPABASE_*` env vars there
   too.

## Notes

- The "Want more?" card on the dashboard links to
  `businesscoachingaccelerator.co.uk` — change or remove that link/text in
  `app/dashboard/page.tsx` if you'd rather not include the upsell, or want
  to point it somewhere else (e.g. a booking page).
- If you'd rather not offer a public sign-up at all (e.g. you want to hand
  out invite links only), the sign-up flow lives entirely in
  `app/signup/page.tsx` — happy to adjust this on request.
