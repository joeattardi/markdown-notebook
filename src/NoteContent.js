import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import NoteEditor from './NoteEditor';

const Container = styled.div`
  padding: 0.5rem;
  height: 100%;
  overflow-y: scroll;

  h1, h2, h3, h4, h5 {
    margin: 0;
  }
`;

export default function NoteContent({ note, isEditing, editText, onChange }) {
  return (
    <Container>
      {note ? isEditing ? <NoteEditor content={editText} onChange={onChange} /> : <ReactMarkdown source={note.content} /> : null}
    </Container>
  );
}
