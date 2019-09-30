import * as ipc from './ipc';

import { SET_EDITING, TOGGLE_EDITING, SET_RENAMING_NOTEBOOK } from './store/app';
import { ADD_NOTEBOOK, ADD_NOTE, DELETE_NOTE, DELETE_NOTEBOOK, SET_NOTES } from './store/notes';

import { showMessageBox } from './interactions';

export async function createNotebook(dispatch) {
  try {
    const newNotebook = await ipc.createNotebook();
    dispatch({ type: ADD_NOTEBOOK, payload: newNotebook });
  } catch (error) {
    showMessageBox({
      message: 'Failed to create a new notebook',
      detail: error.message,
      type: 'error'
    });
  }
}

export async function createNote(notesDispatch, appDispatch, notebook) {
  try {
    const newNote = await ipc.createNote(notebook);
    notesDispatch({ type: ADD_NOTE, payload: newNote });
    appDispatch({ type: SET_EDITING, payload: true });
    ipc.setIsEditing(true);
  } catch (error) {
    showMessageBox({
      type: 'error',
      message: 'Failed to create new note',
      detail: error.message
    });
  }
}

export async function deleteNote(notesDispatch, createSnackbar, currentNote) {
  const result = showMessageBox({
    type: 'question',
    buttons: ['Cancel', 'Confirm'],
    message: 'Delete Note?',
    detail: `This will permanently delete the note "${currentNote.title}" and cannot be undone.`,
    defaultId: 1
  });

  if (result === 1) {
    try {
      await ipc.deleteNote(currentNote.filename);
      notesDispatch({ type: DELETE_NOTE });
      createSnackbar({
        message: `Note "${currentNote.title}" was deleted.`,
        theme: 'success'
      });
    } catch (error) {
      showMessageBox({
        type: 'error',
        message: 'Failed to delete note',
        detail: error.message
      });
    }
  }
}

export async function deleteNotebook(notesDispatch, createSnackbar, notebooks, currentNotebook) {
  const result = showMessageBox({
    type: 'question',
    buttons: ['Cancel', 'Confirm'],
    message: 'Delete Notebook?',
    detail: `This will delete all notes in the notebook "${currentNotebook.name}" and cannot be undone.`,
    defaultId: 1
  });

  if (result === 1) {
    try {
      await ipc.deleteNotebook(currentNotebook.name);
      notesDispatch({ type: DELETE_NOTEBOOK });
      createSnackbar({
        message: `Notebook "${currentNotebook.name}" was deleted.`,
        theme: 'success'
      });

      if (notebooks.length === 1) { // we deleted the last notebook
        notesDispatch({ type: SET_NOTES, payload: [] });
      }
    } catch (error) {
      showMessageBox({
        message: 'Failed to delete the notebook',
        detail: error.message,
        type: 'error'
      });
    }
  }
}

export async function toggleEdit(appDispatch, isEditing, currentNote, noteContent) {
  appDispatch({ type: TOGGLE_EDITING });

  if (isEditing) {
    try {
      await ipc.saveNote({
        ...currentNote,
        content: noteContent
      });
    } catch (error) {
      showMessageBox({
        type: 'error',
        message: 'Failed to save changes',
        detail: error.message
      });
    }
  }

  ipc.setIsEditing(!isEditing);
}

export function renameNotebook(appDispatch) {
  appDispatch({ type: SET_RENAMING_NOTEBOOK, payload: true });
}
