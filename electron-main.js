const { app, BrowserWindow } = require("electron");
const path = require("path");
const { listen } = require("./main");

let server;

function createWindow(port) {
  const win = new BrowserWindow({
    width: 980,
    height: 680,
    minWidth: 760,
    minHeight: 520,
    fullscreen: true,
    backgroundColor: "#080909",
    title: "Findsense",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(() => {
  listen(Number(process.env.PORT || 5173), (port, createdServer) => {
    server = createdServer;
    createWindow(port);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(Number(process.env.PORT || 5173));
    }
  });
});

app.on("window-all-closed", () => {
  if (server) server.close();
  if (process.platform !== "darwin") app.quit();
});
