import { debounce } from 'debounce';

const { ipcRenderer } = window.require('electron');

export function saveNote(note) {
  ipcRenderer.send('saveNote', note);
}

export const debouncedSave = debounce(saveNote, 500);

export function getNote(filename) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('note', (event, note) => resolve(note));
    ipcRenderer.send('getNote', filename);
  });
}

export function getNotebooks() {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebooks', (event, notebooks) => resolve(notebooks));
    ipcRenderer.send('getNotebooks');
  });
}

export function getNotes(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notes', (event, notes) => resolve(notes));
    ipcRenderer.send('getNotes', notebook);
  });
}