import * as ipc from './ipc';

import { actions as appActions } from './store/app';
import { actions as noteActions } from './store/notes';

import { showMessageBox } from './interactions';

const { remote } = window.require('electron');

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

export async function deleteNote(notesDispatch, addToast, note) {
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
      addToast(`Note "${note.title}" was deleted.`, { 
        appearance: 'success',
        autoDismiss: true
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

export async function deleteNotebook(notesDispatch, addToast, notebooks, notebook) {
  const result = showMessageBox({
    type: 'question',
    buttons: ['Cancel', 'Confirm'],
    message: 'Delete Notebook?',
    detail: `This will delete all notes in the notebook "${notebook.name}" and cannot be undone.`,
    defaultId: 1
  });

  if (result === 1) {
    try {
      await ipc.deleteNotebook(notebook.name);
      notesDispatch(noteActions.deleteNotebook(notebook));
      addToast(`Notebook "${notebook.name}" was deleted.`, {
        appearance: 'success',
        autoDismiss: true
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

export async function insertImage(currentNotebook, noteContent, cursorPosition, notesDispatch) {
  const filenames = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(), {
    filters: [
      { name: 'Image', extensions: ['png', 'gif', 'jpg', 'jpeg']}
    ]
  });
  
  if (filenames && filenames.length) {
    try {
      const { url, alt } = await ipc.insertImage(currentNotebook.name, filenames[0]);
      const contentLines = noteContent.split('\n');
      const targetLine = contentLines[cursorPosition.line];
      const newLine = targetLine.substring(0, cursorPosition.ch) + `![${alt}](${url})` + targetLine.substring(cursorPosition.ch);
      contentLines[cursorPosition.line] = newLine;
      notesDispatch(noteActions.setNoteContent(contentLines.join('\n')));
    } catch (error) {
      console.log(error);
    }
  }
}