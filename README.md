# Crown Consultants Website

This project is a Next.js application.
npm install
## Common startup error on Windows

If you run:

```powershell
npm run dev
```

and see:

```text
'next' is not recognized as an internal or external command
```

it means project dependencies are not installed yet (or `node_modules` was removed).

## Fix

Run these commands from the project root:

```powershell
npm install
npm run dev
```

After installation, `next` is available from local project binaries and the dev server should start.

## Standard local setup

```powershell
# 1) Install dependencies
npm install

# 2) Start development server
npm run dev

# 3) Build production bundle
npm run build

# 4) Start production server
npm run start
```

## Notes

- Use a modern Node.js LTS version (Node 20+ recommended for current Next.js versions).
- If `npm run dev` still fails, delete `node_modules` and `package-lock.json`, then run `npm install` again.
