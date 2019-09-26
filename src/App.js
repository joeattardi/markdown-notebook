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
  const [notebooks, setNotebooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNotebook, setCurrentNotebook] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [editText, setEditText] = useState('');

  const [autoSave] = useDebouncedCallback(() => {
    saveCurrentNote();
  }, 1000);

  function toggleEditing() {
    setEditing(!isEditing);
    setCurrentNote({
      ...currentNote,
      content: editText
    });
  }

  function updateNote(content) {
    setEditText(content);
    autoSave();
  }

  function selectNote(note) {
    saveCurrentNote();

    if (note) {
      ipcRenderer.send('getNote', note.filename);
    } else {
      setCurrentNote(null);
      setEditing(false);
      setEditText('');
    }
  }

  function selectNotebook(notebook, save = true) {
    if (save) {
      saveCurrentNote();
    }

    setCurrentNotebook(notebook);
    ipcRenderer.send('getNotes', notebook.name);
  }

  function saveCurrentNote() {
    if (currentNote) {
      ipcRenderer.send('saveNote', {
        ...currentNote,
        content: editText
      });
    }
  }
  
  function deleteNote() {
    if (currentNote) {
      const index = notes.findIndex(note => note.filename === currentNote.filename);

      setNotes(notes.filter(note => note.filename !== currentNote.filename));
      setCurrentNotebook({
        ...currentNotebook,
        count: currentNotebook.count - 1
      });

      setNotebooks(notebooks.map(notebook => {
        if (notebook.id === currentNotebook.id) {
          return {...currentNotebook, count: currentNotebook.count - 1};
        }

        return notebook;
      }));

      if (index === notes.length - 1) {
        selectNote(notes[index - 1]);
      } else {
        selectNote(notes[index + 1]);
      }

      ipcRenderer.send('deleteNote', currentNote.filename);
    }
  }

  function createNewNotebook() {
    ipcRenderer.once('notebookCreated', (event, notebook) => {
      const newNotebooks = [...notebooks, notebook];
      newNotebooks.sort((a, b) => a.name.localeCompare(b.name));
      setNotebooks(newNotebooks);
    });

    ipcRenderer.send('createNotebook');
  }

  function deleteNotebook() {
    ipcRenderer.once('notebookDeleted', () => {
      const index = notebooks.findIndex(notebook => notebook.id === currentNotebook.id);

      setNotebooks(notebooks.filter(notebook => notebook.id !== currentNotebook.id));

      if (index === notebooks.length - 1) {
        selectNotebook(notebooks[index - 1], false);
      } else {
        selectNotebook(notebooks[index + 1], false);
      }
    });

    ipcRenderer.send('deleteNotebook', currentNotebook.name);
  }

  function createNewNote() {
    ipcRenderer.once('noteCreated', (event, note) => {
      setNotes([
        ...notes,
        note
      ]);

      setCurrentNotebook({
        ...currentNotebook,
        count: currentNotebook.count + 1
      });

      setNotebooks(notebooks.map(notebook => {
        if (notebook.id === currentNotebook.id) {
          return {...currentNotebook, count: currentNotebook.count + 1};
        }

        return notebook;
      }));

      selectNote(note);
      setEditing(true);
    });

    ipcRenderer.send('createNote', currentNotebook.name);
  }

  useEffect(() => {
    ipcRenderer.on('note', (event, note) => {
      setCurrentNote(note);
      setEditText(note.content);
    });

    ipcRenderer.on('notes', (event, notes) => {
      setNotes(notes);
      selectNote(notes[0]);
    });

    ipcRenderer.on('notebooks', (event, notebooks) => {
      setNotebooks(notebooks);
      selectNotebook(notebooks[0]);
    });

    ipcRenderer.send('getNotebooks');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ReactTooltip effect="solid" delayShow={250} />
      <div>
        <Container>
          <SplitPane split="vertical" minSize={250} maxSize={500}>
            <Sidebar
              notebooks={notebooks}
              currentNotebook={currentNotebook}
              onCreateNotebook={createNewNotebook}
              onDeleteNotebook={deleteNotebook}
              onChangeNotebook={selectNotebook} />
            <div>
              <Header
                isEditing={isEditing}
                onEditToggle={toggleEditing}
                onNew={createNewNote}
                onDelete={deleteNote} />
              <SplitPane split="vertical" minSize={250} maxSize={500}>
                <NoteList currentNote={currentNote} onChangeNote={selectNote} notes={notes} />
                <NoteContent note={currentNote} editText={editText} onChange={updateNote} isEditing={isEditing} />
              </SplitPane>
            </div>
          </SplitPane>
        </Container>
      </div>
    </ThemeProvider>
  );
}
