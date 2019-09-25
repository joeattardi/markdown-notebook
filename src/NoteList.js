import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Note from './Note';

const { ipcRenderer } = window.require('electron');

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  height: calc(100% - 3.25rem);
`;

export default function NoteList({ onChangeNote }) {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);

  function onClickNote(note) {
    onChangeNote(note);
    setActiveNote(note.id);
  }

  useEffect(() => {
    ipcRenderer.on('notes', (event, notes) => {
      setNotes(notes);
      onClickNote(notes[0]);
    })
  }, [])

  return (
    <Container>
      {notes.map(note => (
        <Note
          active={activeNote === note.id}
          key={note.id}
          note={note}
          onClick={onClickNote} />
      ))}
    </Container>
  );
}
