# UGLost — Campus Lost & Found Portal

A web application for the University of Ghana community to report lost and found items,
search listings, and submit ownership claims that administrators review and approve.

Built as the CSCD602 (Advanced Software Engineering) individual project.

## Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React (Vite), React Router, Axios            |
| Backend  | Node.js, Express                             |
| Database | SQLite via Sequelize                         |
| Photos   | Local disk via Multer                        |
| Auth     | JWT (jsonwebtoken) + bcrypt (bcryptjs)       |

> The SRS / Project Documentation describe MongoDB + Cloudinary. This build follows
> `UGLost_Implementation_Plan.md`, which swaps to SQLite + local disk so the app runs
> with no external accounts. See Section 6 of the plan for the persistence caveat on
> ephemeral hosting.

## Repository layout

```
uglost/
├── client/   # React SPA (Vite)
│   └── src/  # api, context, components, pages
└── server/   # Express API
    ├── models/        # Sequelize models (User, Item, Claim)
    ├── routes/        # auth, item, claim routers
    ├── controllers/   # business logic
    ├── middleware/    # auth, roleGuard, validate, upload, errorHandler
    ├── config/db.js   # Sequelize + SQLite connection
    ├── data/          # uglost.sqlite (gitignored, runtime-created)
    └── uploads/       # item photos (gitignored, runtime-created)
```

## Setup

### 1. Server

```bash
cd server
cp .env.example .env        # then set a real JWT_SECRET
npm install
npm run seed                # creates admin user + sample listings
npm run dev                 # starts on http://localhost:5050
```

> **Port note:** the API runs on `5050` (not the plan's `5000`) because macOS
> AirPlay Receiver occupies port 5000.

### 2. Client

```bash
cd client
cp .env.example .env        # VITE_API_URL=http://localhost:5050/api
npm install
npm run dev                 # starts on http://localhost:5173
```

### Default credentials

| Role  | Email            | Password  |
| ----- | ---------------- | --------- |
| Admin | admin@ug.edu.gh  | admin123  |

## Docker

Runs both services in containers with a named volume for SQLite + uploaded photos
(so data survives `docker compose down` and redeploys — the plan's "Option A" persistent
disk).

```bash
docker compose up -d --build     # build + start
docker compose logs -f server    # follow API logs
docker compose down              # stop (keeps data)
docker compose down -v           # stop AND wipe the volume (fresh re-seed on next up)
```

| Service | URL                              |
| ------- | -------------------------------- |
| Client  | http://localhost:8080            |
| API     | http://localhost:5050/api        |

The server container seeds an admin + sample listings on first boot. To set a real
JWT secret, export `JWT_SECRET` (or a root `.env`) before `docker compose up`:

```bash
JWT_SECRET=$(openssl rand -hex 32) docker compose up -d
```

To point the client at a different API host, pass it as a build arg (it is baked in at
build time):

```bash
docker compose build --build-arg VITE_API_URL=https://api.example.com/api client
```

## Scripts

| Command        | Where  | Purpose                       |
| -------------- | ------ | ----------------------------- |
| `npm run dev`  | server | Run API with nodemon          |
| `npm start`    | server | Run API (plain node)          |
| `npm run seed` | server | Create admin + sample listings |
| `npm run dev`  | client | Run Vite dev server            |
| `npm run build`| client | Production build              |

## API

Base URL: `http://localhost:5050/api`

| Method | Route                        | Auth  | Maps to |
| ------ | ---------------------------- | ----- | ------- |
| POST   | `/auth/register`             | none  | FR1     |
| POST   | `/auth/login`                | none  | FR2     |
| GET    | `/items`                     | none  | FR6     |
| GET    | `/items/mine`                | req   | —       |
| GET    | `/items/:id`                 | none  | FR7     |
| POST   | `/items/lost`                | req   | FR4     |
| POST   | `/items/found`               | req   | FR5     |
| DELETE | `/items/:id`                 | admin | FR11    |
| POST   | `/claims`                    | req   | FR8     |
| GET    | `/claims/pending`            | admin | FR9     |
| GET    | `/claims/mine`               | req   | —       |
| PATCH  | `/claims/:id/approve`        | admin | FR10    |
| PATCH  | `/claims/:id/reject`         | admin | FR10    |
| GET    | `/users/me`                  | req   | —       |

`GET /items` query params: `q`, `category`, `kind`, `status` (use `status=all` for the
admin full listing view; omitted/absent defaults to `active`).

## Notes / accepted technical debt

- `sequelize.sync()` is used instead of migrations (see Technical Debt Plan).
- No rate limiting on auth endpoints (TD-01), no email notifications (FR12 deferred).
- `npm audit` reports a moderate finding in `uuid` (transitive via `sequelize`; the
  "fix" would downgrade sequelize to 3.x) and dev-only findings in `esbuild`/`vite`
  (client). `sqlite3` was upgraded to 6.x, which resolved the earlier `tar`/`node-gyp`
  native-build-chain findings. None affect the runtime app.
- The Docker server image compiles `sqlite3` from source (multi-stage build with a
  toolchain in the builder stage only) because its prebuilt binary targets a newer
  glibc than `node:20-slim` provides.
