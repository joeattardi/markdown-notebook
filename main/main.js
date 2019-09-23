const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');

const isDev = require('electron-is-dev');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(isDev ? 'http://localhost:4000' : `file://${path.join(__dirname, '..', 'build', 'index.html')}`);

  if (isDev) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.maximize();
}

app.on('ready', createWindow);
