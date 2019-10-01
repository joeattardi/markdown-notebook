import React, { useContext } from 'react';
import styled from 'styled-components';

import NoteEditor from './NoteEditor';
import NoteView from './NoteView';

import { showMessageBox } from './interactions';
import { debouncedSave, renameNote } from './ipc';

import { actions as appActions } from './store/app';
import { actions as noteActions } from './store/notes';
import { App, Notes } from './store';

const Container = styled.div`
  padding: 0.5rem;
  height: 100%;
  overflow-y: scroll;

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0;
  }
`;

export default function NoteContent() {
  const { currentNotebook, currentNote, noteContent, noteTitle } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  const appDispatch = useContext(App.Dispatch);
  const { isEditing } = useContext(App.State);

  function onNoteChange(content) {
    debouncedSave({
      ...currentNote,
      content
    });

    notesDispatch(noteActions.setNoteContent(content));
  }

  function onTitleChange(title) {
    notesDispatch(noteActions.setNoteTitle(title));
  }

  function onExitEdit() {
    appDispatch(appActions.setEditing(false));
  }

  async function onRename() {
    try {
      const newFilename = await renameNote(currentNotebook.name, {
        ...currentNote,
        content: noteContent
      }, noteTitle);
      notesDispatch(noteActions.renameNote({
        title: noteTitle,
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

  return (
    <Container>
      {currentNote ? (
        isEditing ? (
          <NoteEditor
            title={noteTitle}
            content={noteContent}
            onTitleChange={onTitleChange}
            onExitEdit={onExitEdit}
            onChange={onNoteChange} 
            onRename={onRename} />
        ) : (
          <NoteView title={currentNote.title} content={noteContent} />
        )
      ) : null}
    </Container>
  );
}
