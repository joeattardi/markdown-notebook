import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import Note from './Note';

import { SET_CURRENT_NOTE, SET_NOTE_CONTENT } from './store/notes';
import { Notes } from './store';

const { ipcRenderer } = window.require('electron');

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  height: calc(100% - 3.25rem);
`;

export default function NoteList() {
  const { notes, currentNote, noteContent } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  function onClickNote(note) {
    ipcRenderer.send('saveNote', {
      ...currentNote,
      content: noteContent
    });

    notesDispatch({ type: SET_CURRENT_NOTE, payload: note });
  }

  useEffect(() => {
    if (currentNote) {
      ipcRenderer.once('note', (event, note) => {
        notesDispatch({ type: SET_NOTE_CONTENT, payload: note.content });
      });

      ipcRenderer.send('getNote', currentNote.filename);
    } else {
      notesDispatch({ type: SET_NOTE_CONTENT, payload: '' });
    }
  }, [notesDispatch, currentNote]);

  return (
    <Container>
      {notes.map(note => (
        <Note
          active={currentNote === note}
          key={note.id}
          note={note}
          onClick={onClickNote} />
      ))}
    </Container>
  );
}
