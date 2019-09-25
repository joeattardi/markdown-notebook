import React, { useEffect, useState } from 'react';

import SplitPane from 'react-split-pane';
import ReactTooltip from 'react-tooltip'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';

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
  const [editText, setEditText] = useState('');

  const [autoSave] = useDebouncedCallback(() => {
    saveCurrentNote();
  }, 1000);

  function toggleEditing() {
    setEditing(!isEditing);
  }

  function updateNote(content) {
    setEditText(content);
    autoSave();
  }

  function changeNote(note) {
    saveCurrentNote();
    ipcRenderer.send('getNote', note.filename);
  }

  function saveCurrentNote() {
    if (currentNote) {
      ipcRenderer.send('saveNote', {
        ...currentNote,
        content: editText
      });
    }
  }
  
  useEffect(() => {
    ipcRenderer.on('note', (event, note) => {
      setCurrentNote(note);
      setEditText(note.content);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ReactTooltip effect="solid" delayShow={250} />
      <div>
        <Container>
          <SplitPane split="vertical" minSize={250} maxSize={500}>
            <Sidebar onChangeNotebook={saveCurrentNote} />
            <div>
              <Header isEditing={isEditing} onEditToggle={toggleEditing} />
              <SplitPane split="vertical" minSize={250} maxSize={500}>
                <NoteList onChangeNote={changeNote} />
                <NoteContent note={currentNote} editText={editText} onChange={updateNote} isEditing={isEditing} />
              </SplitPane>
            </div>
          </SplitPane>
        </Container>
      </div>
    </ThemeProvider>
  );
}
