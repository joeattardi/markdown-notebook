import React from 'react';
import styled from 'styled-components';

import Note from './Note';

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  height: calc(100% - 3.25rem);
`;

export default function NoteList({ currentNote, notes, onChangeNote }) {
  function onClickNote(note) {
    onChangeNote(note);
  }

  return (
    <Container>
      {notes.map(note => (
        <Note
          active={currentNote && currentNote.filename === note.filename}
          key={note.id}
          note={note}
          onClick={onClickNote} />
      ))}
    </Container>
  );
}
