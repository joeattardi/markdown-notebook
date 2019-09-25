import React, { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';

import Header from './Header';
import NoteContent from './NoteContent';
import NoteList from './NoteList';
import Sidebar from './Sidebar';

const { ipcRenderer } = window.require('electron');

const theme = {
  headerBackground: '#EEEEEE',
  sidebarBackground: '#294E72',
  sidebarHoverBackground: 'rgba(255, 255, 255, 0.2)',
  sidebarActiveBackground: 'rgba(0, 0, 0, 0.2)'
};

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', sans-serif;
  }
`;

const Container = styled.div`
  height: 100vh;
  position: relative;

  .Resizer {
    position: relative;
    margin-left: -5px;
    width: 5px;
    cursor: ew-resize;
  }
`;

export default function App() {
  const [isEditing, setEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  function toggleEditing() {
    setEditing(!isEditing);
  }

  function updateNote(content) {
    setCurrentNote({
      ...currentNote,
      content
    });
  }

  useEffect(() => {
    ipcRenderer.once('note', (event, note) => {
      if (currentNote) {
        ipcRenderer.send('saveNote', currentNote);
      }

      setCurrentNote(note);
    });
  }, [currentNote]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div>
        <Container>
          <SplitPane split="vertical" minSize={250} maxSize={500}>
            <Sidebar />
            <div>
              <Header isEditing={isEditing} onEditToggle={toggleEditing} />
              <SplitPane split="vertical" minSize={250} maxSize={500}>
                <NoteList />
                <NoteContent note={currentNote} onChange={updateNote} isEditing={isEditing} />
              </SplitPane>
            </div>
          </SplitPane>
        </Container>
      </div>
    </ThemeProvider>
  );
}
