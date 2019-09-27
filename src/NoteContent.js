import React, { useContext } from 'react';
import styled from 'styled-components';

import NoteEditor from './NoteEditor';
import NoteView from './NoteView';

import { debouncedSave, renameNote } from './ipc';

import { SET_EDITING } from './store/app';
import { RENAME_NOTE, SET_NOTE_CONTENT, SET_NOTE_TITLE } from './store/notes';
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

    notesDispatch({ type: SET_NOTE_CONTENT, payload: content });
  }

  function onTitleChange(title) {
    notesDispatch({ type: SET_NOTE_TITLE, payload: title });
  }

  function onExitEdit() {
    appDispatch({ type: SET_EDITING, payload: false });
  }

  async function onRename() {
    const newFilename = await renameNote(currentNotebook.name, {
      ...currentNote,
      content: noteContent
    }, noteTitle);
    notesDispatch({ type: RENAME_NOTE, payload: {
      title: noteTitle,
      filename: newFilename
    }});
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
