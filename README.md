# COMSATS Literary Society website

Next.js 16 App Router site with a built in CMS, member desks, Executive Council profiles and a 3D Hall of Years.

## Setup

1. Copy `.env.example` to `.env.local` and fill it in. `ADMIN_PASSWORD` must be unique and at least 10 characters. Set `SETUP_TOKEN` in production.
2. `npm install`
3. `npm run dev`
4. First run only: `npm run setup`. With `SETUP_TOKEN` set, send it as the `x-setup-token` header instead.
5. Sign in at `/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then change that password.

## How content works

Every public page reads from MongoDB through cached queries (5 minute revalidate, cleared instantly when admin saves). If the database is empty or unreachable, starter copy from `src/config/defaults.js` is shown.

Admin (`/admin`) controls site settings, home background video and showcase frame, every page's copy and images, events with galleries, workshops, writings, history tenures, constitution files, people, and the media library (`/admin/media`).

## Leadership

Core members and Executive Council members create an account at `/staff/apply`, then fill their profile at `/staff/setup` (portrait, bio, position). They appear on `/leadership` only after admin approves them at `/admin/people`. Executive Council is shown under Core as Directorates, Leads, then Co-Leads. Admin can reorder anyone with the order field.

## Media

Uploads go to GridFS. Images are resized to 2000px and converted to WebP, videos stream with range requests. Every image or video shown inside a bordered photo frame is placed in the frame window, centered and cropped to fit, so any aspect ratio works.
