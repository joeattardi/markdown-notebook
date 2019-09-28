import { debounce } from 'debounce';

const { ipcRenderer } = window.require('electron');

export function saveNote(note) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('noteSaved', (event, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    ipcRenderer.send('saveNote', note);
  });
}

export const debouncedSave = debounce(saveNote, 500);

export function getNote(filename) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('note', (event, error, note) => {
      if (error) {
        reject(error);
      } else {
        resolve(note);
      }
    });
    ipcRenderer.send('getNote', filename);
  });
}

export function getNotebooks() {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebooks', (event, error, notebooks) => {
      if (error) {
        reject(error);
      } else {
        resolve(notebooks);
      }
    });
    ipcRenderer.send('getNotebooks');
  });
}

export function getNotes(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notes', (event, error, notes) => {
      if (error) {
        reject(error);
      } else {
        resolve(notes);
      }
    });
    ipcRenderer.send('getNotes', notebook);
  });
}

export function createNote(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('noteCreated', (event, error, note) => {
      if (error) {
        reject(error);
      } else {
        resolve(note);
      }
    });
    ipcRenderer.send('createNote', notebook);
  });
}

export function deleteNote(filename) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('noteDeleted', (event, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    ipcRenderer.send('deleteNote', filename);
  });
}

export function createNotebook() {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebookCreated', (event, error, notebook) => {
      if (notebook) {
        resolve(notebook);
      } else {
        reject(error);
      }
    });
    
    ipcRenderer.send('createNotebook');
  });
}

export function deleteNotebook(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebookDeleted', (event, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    ipcRenderer.send('deleteNotebook', notebook);
  });
}

export function renameNotebook(notebook, newName) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('notebookRenamed', (event, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    ipcRenderer.send('renameNotebook', notebook, newName);
  });
}

export function renameNote(notebook, note, newName) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('noteRenamed', (event, error, filename) => {
      if (error) {
        reject(error);
      } else {
        resolve(filename);
      }
    });
    ipcRenderer.send('renameNote', notebook, note, newName);
  });
}

export function confirmDeleteNotebook(notebook) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('confirmDeleteNotebook', (event, result) => resolve(result));
    ipcRenderer.send('confirmDeleteNotebook', notebook);
  });
}
