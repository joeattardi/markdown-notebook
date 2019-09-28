const { ipcRenderer } = window.require('electron');

export function showMessageBox(options) {
  ipcRenderer.send('showMessageBox', options);
}
