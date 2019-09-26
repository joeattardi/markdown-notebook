import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import NoteEditor from './NoteEditor';

import { SET_NOTE_CONTENT } from './store/notes';
import { Notes } from './store';

const Container = styled.div`
  padding: 0.5rem;
  height: 100%;
  overflow-y: scroll;

  h1, h2, h3, h4, h5 {
    margin: 0;
  }
`;

export default function NoteContent({ isEditing }) {
  const { noteContent } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  function onNoteChange(content) {
    notesDispatch({ type: SET_NOTE_CONTENT, payload: content });
  }

  return (
    <Container>
      {noteContent ? isEditing ? <NoteEditor content={noteContent} onChange={onNoteChange} /> : <ReactMarkdown source={noteContent} /> : null}
    </Container>
  );
}
