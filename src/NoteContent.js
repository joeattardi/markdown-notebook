import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const { ipcRenderer } = window.require('electron');

const Container = styled.div`
  padding: 0.5rem;
  height: 100%;
  overflow-y: scroll;

  h1, h2, h3, h4, h5 {
    margin: 0;
  }
`;

export default function NoteContent() {
  const [note, setNote] = useState('');

  useEffect(() => {
    ipcRenderer.on('note', (event, noteContent) => {
      setNote(noteContent);
    });
  }, []);

  return (
    <Container>
      <ReactMarkdown source={note} />
    </Container>
  );
}
