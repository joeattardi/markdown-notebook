const { dialog, ipcMain } = require('electron');

let mainWindow;

ipcMain.on('showMessageBox', (event, options) => {
  dialog.showMessageBoxSync(mainWindow, options);
});

exports.setMainWindow = function(window) {
  mainWindow = window;
};