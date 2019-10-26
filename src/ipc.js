import { debounce } from 'debounce';

const { ipcRenderer } = window.require('electron');

export function saveNote(note) {
  return ipcRenderer.invoke('saveNote', note);
}

export const debouncedSave = debounce(saveNote, 500);

export function getNote(filename) {
  return ipcRenderer.invoke('getNote', filename);
}

export function getNotebooks() {
  return ipcRenderer.invoke('getNotebooks');
}

export function getNotes(notebook) {
  return ipcRenderer.invoke('getNotes', notebook);
}

export function createNote(notebook) {
  return ipcRenderer.invoke('createNote', notebook);
}

export function deleteNote(filename) {
  return ipcRenderer.invoke('deleteNote', filename);
}

export function createNotebook() {
  return ipcRenderer.invoke('createNotebook');
}

export function deleteNotebook(notebook) {
  return ipcRenderer.invoke('deleteNotebook', notebook);
}

export function renameNotebook(notebook, newName) {
  return ipcRenderer.invoke('renameNotebook', notebook, newName);
}

export function renameNote(notebook, note, newName) {
  return ipcRenderer.invoke('renameNote', notebook, note, newName);
}

export function setIsEditing(isEditing) {
  ipcRenderer.send('isEditing', isEditing);
}

export function insertImage(notebook, imagePath) {
  return ipcRenderer.invoke('insertImage', notebook, imagePath);
}
