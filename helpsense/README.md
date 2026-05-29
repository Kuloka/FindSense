  <img width="396" height="104" alt="image" src="https://github.com/user-attachments/assets/8a1ff54f-c588-427f-8688-2dc3c4aec431" />
<img width="110" height="113" alt="image" src="https://github.com/user-attachments/assets/9de45a49-b3fd-4579-b3d6-d8bc051e8ea7" />


helpsense desktop
=================

Cross-platform desktop helper with ChatGPT-style chat, translator, themes and watermark.

This version is a desktop application project for Windows, macOS and Linux.
It includes a chat screen, Google Translate-style translator, original
color themes plus flag themes, watermark settings, saved chats and quick tools,
but it does not automate message sending.
Smartes than chatgpt in math you can use it comfortable

<<<<<<< HEAD
Requirements
------------
PREVIEW

<img width="961" height="671" alt="image" src="https://github.com/user-attachments/assets/97fe5e57-e286-41d1-9ad3-c79efc08ec88" />



- Node.js 20 or newer
- npm
- Built-in no-key online fallback: Pollinations text API
- Optional hidden advanced mode: `OPENAI_API_KEY`
- Optional no-key mode: Ollama running locally with at least one downloaded model

Run in development
------------------

Windows quick start:

Double-click `start-helpsense.cmd`.

Windows shortcut with icon:

Double-click `helpsense.lnk`.

Manual start:

```bash
npm install
npm run start
```

Build executables
-----------------

Windows:

```bash
npm run dist:win
```

Or double-click `build-win-onefile.cmd`. The portable one-file `.exe` appears
in `release/`.

macOS:

```bash
npm run dist:mac
```

Linux:

```bash
npm run dist:linux
```

Build output appears in `release/`.
CAN BUG ON WIN DONT OPEN 2 WINDOWS OR SECOND WINDOW GET BLACK SCREEN
