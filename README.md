# Industrial Summit Private Registration

A separate, link-only Industrial Summit registration form built with Next.js and Supabase.

## What this project does

- Reuses the same fields and visual design as the Individual registration form.
- Saves submissions to `public.summit_private_registrations`, separate from paid registrations.
- Does not create a Razorpay order, collect payment, apply redeem codes, or send email.
- Shows a simple success screen after a valid submission.
- Adds an authenticated admin sidebar with two sections:
  - Paid registrations from the existing public form.
  - Link-only entries from this private form.
- Does not add a button or link to this form from the existing public registration project.

## Supabase setup

This project is designed to use the same Supabase project as the existing Industrial Summit registration site.

Run the new migration in that Supabase project before deploying:

```text
supabase/migrations/20260814060900_create_private_summit_registrations.sql
```

The table has RLS enabled and is not available to `anon` or `authenticated` browser roles. Form submissions and admin reads go through the server-only Supabase secret key. Existing `summit_admins` access continues to protect `/admin`.

## Netlify setup

Recommended Netlify project name:

```text
Industrial Summit Private Registration
```

Recommended site slug:

```text
industrial-summit-private-registration
```

Import this GitHub repository into Netlify and configure the variables in `.env.example`. Use the same Supabase URL, publishable key, secret key, and admin credentials as the existing registration site. Razorpay and Resend variables are not required for this private flow.

## Routes

- `/` — link-only attendee form
- `/submitted` — successful submission confirmation
- `/admin` — paid registrations
- `/admin/private` — link-only submissions
- `/admin/login` — administrator login

## Local development

```bash
npm install
npm run dev
```

Do not commit `.env.local` or any Supabase secret key.
