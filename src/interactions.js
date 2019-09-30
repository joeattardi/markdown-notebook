const { remote } = window.require('electron');

const mainWindow = remote.getCurrentWindow();

export function showMessageBox(options) {
  return remote.dialog.showMessageBoxSync(mainWindow, options);
}
