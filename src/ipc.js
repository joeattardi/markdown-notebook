import { debounce } from 'debounce';

const { ipcRenderer } = window.require('electron');

function callApi(call, response, ...callArgs) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(response, (event, error, ...responseArgs) => {
      if (error) {
        reject(error);
      } else {
        resolve(...responseArgs);
      }
    });

    ipcRenderer.send(call, ...callArgs);
  });
}

export function saveNote(note) {
  return callApi('saveNote', 'noteSaved', note);
}

export const debouncedSave = debounce(saveNote, 500);

export function getNote(filename) {
  return callApi('getNote', 'note', filename);
}

export function getNotebooks() {
  return callApi('getNotebooks', 'notebooks');
}

export function getNotes(notebook) {
  return callApi('getNotes', 'notes', notebook);
}

export function createNote(notebook) {
  return callApi('createNote', 'noteCreated', notebook);
}

export function deleteNote(filename) {
  return callApi('deleteNote', 'noteDeleted', filename);
}

export function createNotebook() {
  return callApi('createNotebook', 'notebookCreated');
}

export function deleteNotebook(notebook) {
  return callApi('deleteNotebook', 'notebookDeleted', notebook);
}

export function renameNotebook(notebook, newName) {
  return callApi('renameNotebook', 'notebookRenamed', notebook, newName);
}

export function renameNote(notebook, note, newName) {
  return callApi('renameNote', 'noteRenamed', notebook, note, newName);
}

export function setIsEditing(isEditing) {
  ipcRenderer.send('isEditing', isEditing);
}
