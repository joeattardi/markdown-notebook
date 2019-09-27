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

export function createNote(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('noteCreated', (event, note) => resolve(note));
    ipcRenderer.send('createNote', notebook);
  });
}

export function deleteNote(filename) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('noteDeleted', event => resolve());
    ipcRenderer.send('deleteNote', filename);
  });
}

export function createNotebook() {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebookCreated', (event, notebook) => resolve(notebook));
    ipcRenderer.send('createNotebook');
  });
}

export function deleteNotebook(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebookDeleted', event => resolve());
    ipcRenderer.send('deleteNotebook', notebook);
  });
}

export function renameNotebook(notebook, newName) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebookRenamed', event => resolve());
    ipcRenderer.send('renameNotebook', notebook, newName);
  });
}
