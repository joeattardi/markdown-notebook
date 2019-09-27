import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import Note from './Note';

import { getNote, saveNote } from './ipc';

import { SET_CURRENT_NOTE, SET_NOTE_CONTENT } from './store/notes';
import { Notes } from './store';

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  height: calc(100% - 3.25rem);
`;

export default function NoteList() {
  const { notes, currentNote, noteContent } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  function onClickNote(note) {
    saveNote({
      ...currentNote,
      content: noteContent
    });

    notesDispatch({ type: SET_CURRENT_NOTE, payload: note });
  }

  useEffect(() => {
    async function setNoteContent() {
      if (currentNote) {
        const note = await getNote(currentNote.filename);
        notesDispatch({ type: SET_NOTE_CONTENT, payload: note.content });
      } else {
        notesDispatch({ type: SET_NOTE_CONTENT, payload: '' });
      }
    }

    setNoteContent();
  }, [notesDispatch, currentNote]);

  return (
    <Container>
      {notes.map(note => (
        <Note
          active={currentNote.filename === note.filename}
          key={note.id}
          note={note}
          onClick={onClickNote} />
      ))}
    </Container>
  );
}
