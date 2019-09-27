const fs = require('fs-extra');
const path = require('path');

const debug = require('debug')('markdown-notebook:main');
const { app, BrowserWindow } = require('electron');

const isDev = require('electron-is-dev');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const { DATA_DIRECTORY, NOTE_DIRECTORY } = require('./config');
require('./notes');

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

function checkDataDirectory() {
  debug('Checking data directory');
  if (!fs.existsSync(DATA_DIRECTORY)) {
    debug(`Data directory ${DATA_DIRECTORY} does not exist, creating.`);
    fs.mkdirSync(DATA_DIRECTORY);
  }

  if (!fs.existsSync(NOTE_DIRECTORY)) {
    debug(`Note directory ${NOTE_DIRECTORY} does not exist, creating.`);
    fs.mkdirSync(NOTE_DIRECTORY);
    createSampleData();
  }
}

function createSampleData() {
  debug('Creating sample data');
  fs.mkdirSync(path.resolve(NOTE_DIRECTORY, 'Notes'));
  fs.copyFileSync(
    path.resolve(__dirname, '..', 'sampleData', 'welcome.md'),
    path.resolve(NOTE_DIRECTORY, 'Notes', 'welcome.md')
  );
}

app.on('ready', () => {
  checkDataDirectory();
  createWindow();
});
