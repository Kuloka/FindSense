# FindSense

FindSense is a desktop and local-browser username scanner for Telegram, Discord, and TikTok. It generates short username candidates, checks availability signals, and keeps found free usernames in persistent lists.

## Features

- Telegram, Discord, and TikTok username candidate generation.
- Manual username checks.
- Auto search mode for repeated candidate batches.
- Persistent free username lists.
- Copy/export tools for found usernames.
- Optional Telegram external checks.
- Desktop mode with Electron, plus browser-server fallback.
- Russian and English interface language setting.




<img width="2559" height="1391" alt="image" src="https://github.com/user-attachments/assets/b3c301e5-0869-4e77-a322-7c0dd0fa8cb4" />







## Requirements

- Node.js 20 or newer
- npm

## Install

```powershell
npm install
```

## Run

Desktop app:

```powershell
start-findsense.cmd
```

Or through npm:

```powershell
npm run app
```

Browser server only:

```powershell
npm start
```

Then open:

```text
http://localhost:5173
```

## Telegram API Login

Some Telegram checks can use Telegram API credentials. If you have configured `telegram-config.json`, run:

```powershell
npm run telegram:login
```

Do not commit `telegram-config.json`, session files, logs, generated username lists, or packaged build folders.

## Git Notes

The repository ignores build outputs and large binaries:

```gitignore
node_modules/
auto-usernames/
win unlocked/
win-unlocked/
*.exe
```

GitHub rejects files larger than 100 MB, so Electron build folders should be distributed through releases or rebuilt locally instead of committed.

## Scripts

```text
npm start           Start local server
npm run app         Start Electron desktop app
npm run telegram:login
```

## License

Private project by Kuloka.
