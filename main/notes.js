const fs = require('fs');
const path = require('path');

const { app, ipcMain } = require('electron');

const NOTE_DIRECTORY = path.resolve(app.getPath('home'), 'markdown-notebook');

function getNotebooks() {
  return fs.readdirSync(NOTE_DIRECTORY);
};

ipcMain.on('getNotebooks', event => {
  event.sender.send('notebooks', getNotebooks());
});
