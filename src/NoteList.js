import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Note from './Note';

const { ipcRenderer } = window.require('electron');

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  height: 100%;
`;

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);

  function onClickNote(note) {
    setActiveNote(note.id);
    ipcRenderer.send('getNote', note.filename);
  }

  useEffect(() => {
    ipcRenderer.on('notes', (event, notes) => {
      setNotes(notes);
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
