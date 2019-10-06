import * as ipc from './ipc';

import { actions as appActions } from './store/app';
import { actions as noteActions } from './store/notes';

import { showMessageBox } from './interactions';

export async function createNotebook(dispatch) {
  try {
    const newNotebook = await ipc.createNotebook();
    dispatch(noteActions.addNotebook(newNotebook));
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
    notesDispatch(noteActions.addNote(newNote));
    appDispatch(appActions.setEditing(true));
    ipc.setIsEditing(true);
  } catch (error) {
    showMessageBox({
      type: 'error',
      message: 'Failed to create new note',
      detail: error.message
    });
  }
}

export async function deleteNote(notesDispatch, createSnackbar, note) {
  const result = showMessageBox({
    type: 'question',
    buttons: ['Cancel', 'Confirm'],
    message: 'Delete Note?',
    detail: `This will permanently delete the note "${note.title}" and cannot be undone.`,
    defaultId: 1
  });

  if (result === 1) {
    try {
      await ipc.deleteNote(note.filename);
      notesDispatch(noteActions.deleteNote(note));
      createSnackbar({
        message: `Note "${note.title}" was deleted.`,
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
      notesDispatch(noteActions.deleteNotebook());
      createSnackbar({
        message: `Notebook "${currentNotebook.name}" was deleted.`,
        theme: 'success'
      });

      if (notebooks.length === 1) { // we deleted the last notebook
        notesDispatch(noteActions.setNotes([]));
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
  appDispatch(appActions.toggleEditing());

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

export async function renameNote(notesDispatch, currentNotebook, currentNote, noteContent, newTitle) {
  try {
    const newFilename = await ipc.renameNote(currentNotebook.name, {
      ...currentNote,
      content: noteContent
    }, newTitle);
    notesDispatch(noteActions.renameNote({
      title: newTitle,
      filename: newFilename
    }));
  } catch (error) {
    notesDispatch(noteActions.setNoteTitle(currentNote.title));
    showMessageBox({
      type: 'error',
      message: 'Failed to rename note',
      detail: error.message
    });
  }
}

export function renameNotebook(appDispatch) {
  appDispatch(appActions.setRenamingNotebook(true));
}
