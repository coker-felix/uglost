# Deploying UGLost to Render

This guide deploys the **API** (Express + SQLite) and the **client** (React/Vite) to
Render, using the `render.yaml` blueprint at the repo root.

> **One decision up front — free vs paid:**
> - **Free** works with no credit card, but Render's filesystem is *ephemeral* — the
>   SQLite DB and uploaded photos reset on every redeploy/restart. The seed script
>   re-creates the admin + test accounts automatically, so the app is never empty,
>   but any real data is lost. Fine for a demo window.
> - **Paid** (Starter, ~$7/mo) lets you attach a persistent disk, so data survives.
>   This is the plan's "Option A" persistent-disk approach.

## Prerequisites

1. The repo pushed to GitHub (done — `coker-felix/uglost`).
2. A [Render](https://render.com) account.

## Option A — Deploy via Blueprint (recommended)

1. In the Render dashboard, click **New → Blueprint**.
2. Connect your GitHub account and select the `uglost` repository.
3. Render reads `render.yaml` and creates two services: `uglost-api` and
   `uglost-client`. Click **Apply**.

**To enable persistent data (paid):** before applying, open the `uglost-api` service
definition and (a) change `plan` to `starter`, and (b) uncomment the `disk` block in
`render.yaml`. Commit that change and re-sync.

## Option B — Manual setup (no blueprint)

**API service:**
1. **New → Web Service**, connect the repo.
2. Set the root directory to `server`, runtime **Docker**.
3. Under **Advanced → Add Disk**: mount path `/data`, size `1 GB` (paid only).
4. Add environment variables (see `server/.env.production.example`):
   `DATABASE_PATH=/data/uglost.sqlite`, `UPLOAD_DIR=/data/uploads`,
   `JWT_SECRET=<random>`, `JWT_EXPIRES_IN=7d`, `MAX_UPLOAD_MB=5`, `CLIENT_ORIGIN=*`.

**Client (static site):**
1. **New → Static Site**, connect the repo.
2. Root directory `client`, build command `npm install && npm run build`,
   publish directory `dist`.
3. Add `VITE_API_URL` = `https://<your-api-name>.onrender.com/api`.

## Step 4 — Point the client at the API (Blueprint path)

The client bakes `VITE_API_URL` in at build time, so it must know the API's final URL:

1. After the API deploys, find its URL in the Render dashboard
   (e.g. `https://uglost-api.onrender.com`).
2. In `render.yaml`, set the client's `VITE_API_URL` to that URL + `/api`
   (e.g. `https://uglost-api.onrender.com/api`).
3. Commit and push; the client rebuilds and redeploys automatically.

## Default accounts (created by the seed script on boot)

| Email | Password | Role |
|---|---|---|
| `admin@ug.edu.gh` | `admin123` | admin |
| `test.student@st.ug.edu.gh` | `student123` | student |

## Smoke test on the live URL

Run the ST-01 → ST-05 sequence from `Testing_Report.md` against the deployed client:
register → report a found item (with a photo) → search → claim → admin approve. Confirm
an uploaded photo still loads after a page refresh.

## Backing up (free/ephemeral only)

On the free plan, download `data/uglost.sqlite` before pushing a redeploy, so you have a
restore point if you need to recover data mid-grading-window.
