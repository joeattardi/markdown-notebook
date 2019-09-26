import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import NoteEditor from './NoteEditor';

import { Notes } from './store';

const Container = styled.div`
  padding: 0.5rem;
  height: 100%;
  overflow-y: scroll;

  h1, h2, h3, h4, h5 {
    margin: 0;
  }
`;

export default function NoteContent({ isEditing, editText, onChange }) {
  const { noteContent } = useContext(Notes.State);

  return (
    <Container>
      {noteContent ? isEditing ? <NoteEditor content={editText} onChange={onChange} /> : <ReactMarkdown source={noteContent} /> : null}
    </Container>
  );
}
