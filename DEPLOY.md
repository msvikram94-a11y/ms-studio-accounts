# MS Studio Accounts — Deploy to Vercel (with free cloud database)

This makes the app live on the internet and lets **all counters sync to the Admin dashboard**,
even when each counter is on a different phone. The database is **Upstash Redis**, added free
through the Vercel Marketplace. Your secret database key stays on the server — never in the browser.

## What's in this project
```
index.html      ← the app (login, counters, admin dashboard)
api/ping.js      ← tells the app whether the database is connected
api/load.js      ← reads a shop's data
api/save.js      ← saves a shop's data
```

## Logins
- Counters: `yercaud` / `yercaudpass`, `photobox` / `photoboxpass`, `pykara` / `pykarapass`, `ooty` / `ootypass`
- Admin dashboard: `admin` / `adminpass`
(You can change any of these later in `index.html`, in the `SHOPS` section near the top of the script.)

---

## Step 1 — Put the project on GitHub (easiest for Vercel)
1. Go to **github.com** → **New repository** → name it `ms-studio-accounts` → **Create**.
2. Click **uploading an existing file** → drag in `index.html`, the `api` folder, and `DEPLOY.md` → **Commit**.

(If you'd rather not use GitHub, you can instead install the Vercel CLI and run `vercel` from the
folder — but GitHub is simpler and gives automatic redeploys on every change.)

## Step 2 — Create the project on Vercel
1. Go to **vercel.com** → sign in with GitHub.
2. **Add New… → Project** → pick the `ms-studio-accounts` repo → **Deploy**.
3. Wait ~1 minute. You'll get a link like `ms-studio-accounts.vercel.app`.
   At this point the app works, but data is still per-device (no database yet).

## Step 3 — Add the free database (Upstash Redis)
1. In your Vercel project, open the **Storage** tab.
2. Click **Create Database** → choose **Upstash → Redis** (Marketplace) → pick the **Free** plan → **Continue**.
3. When asked, **connect it to this project**. Vercel automatically adds the connection keys
   (`KV_REST_API_URL` / `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`)
   as **Environment Variables** — you don't need to copy anything by hand.

## Step 4 — Redeploy so it picks up the database
1. Go to the **Deployments** tab → open the latest → **⋯ (three dots) → Redeploy**.
2. Done. Open your `*.vercel.app` link.

## Step 5 — Test the sync
1. On one device/browser, log in as `yercaud`, open the day, enter closing, **Save**.
2. On another device/browser, log in as `admin` → the Yercaud numbers show on the dashboard.
   That's the cloud database working.

---

## How to tell if the database is connected
Open `https://your-app.vercel.app/api/ping` in a browser.
- `{"ok":true,"db":true}` → database connected ✅
- `{"ok":true,"db":false}` → not connected yet (finish Step 3, then redeploy).

## Notes
- **Free tier** is plenty for daily counter accounts (small JSON per shop per day).
- The app still works if the database is ever unreachable — it keeps a copy on the device and
  syncs the next time it can reach the server.
- To change logins, products, or rates in bulk, edit `index.html` and re-upload to GitHub;
  Vercel redeploys automatically.
