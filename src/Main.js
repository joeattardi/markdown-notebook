import React, { useContext, useEffect } from 'react';

import SplitPane from 'react-split-pane';
import { wrapComponent } from 'react-snackbar-alert';
import styled from 'styled-components';

import Header from './Header';
import NoteContent from './NoteContent';
import NoteList from './NoteList';
import Sidebar from './Sidebar';

import RenameNotebookModal from './RenameNotebookModal';

import { 
  createNote,
  createNotebook,
  deleteNote,
  deleteNotebook,
  toggleEdit,
  renameNotebook,
  renameNote
} from './actions';

import { App, Notes } from './store';

const { ipcRenderer } = window.require('electron');

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

function Main({ createSnackbar }) {
  const { currentNotebook, currentNote, notebooks, noteContent, noteTitle } = useContext(Notes.State);
  const { isEditing } = useContext(App.State);

  const appDispatch = useContext(App.Dispatch);
  const notesDispatch = useContext(Notes.Dispatch);

  useEffect(() => {
    ipcRenderer.on('menu:createNotebook', () => {
      createNotebook(notesDispatch);
    });
  }, [notesDispatch]);

  useEffect(() => {
    ipcRenderer.on('menu:renameNotebook', () => {
      renameNotebook(appDispatch);
    });
  }, [appDispatch])

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:createNote');
    ipcRenderer.on('menu:createNote', () => {
      createNote(notesDispatch, appDispatch, currentNotebook.name);
    });
  }, [appDispatch, notesDispatch, currentNotebook]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:deleteNote');
    ipcRenderer.on('menu:deleteNote', () => {
      deleteNote(notesDispatch, createSnackbar, currentNote);
    });
  }, [appDispatch, currentNote, createSnackbar, notesDispatch]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:deleteNotebook');
    ipcRenderer.on('menu:deleteNotebook', () => {
      deleteNotebook(notesDispatch, createSnackbar, notebooks, currentNotebook);
    })
  }, [notesDispatch, createSnackbar, notebooks, currentNotebook]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:toggleEdit');
    ipcRenderer.on('menu:toggleEdit', async event => {
      toggleEdit(appDispatch, isEditing, currentNote, noteContent);
      renameNote(notesDispatch, currentNotebook, currentNote, noteContent, noteTitle);
    });
  }, [appDispatch, notesDispatch, isEditing, currentNote, noteContent, currentNotebook, noteTitle]);

  return (
    <div>
      <Container>
        <SplitPane split="vertical" minSize={250} maxSize={500}>
          <Sidebar />
          <div>
            <Header />
            <SplitPane split="vertical" minSize={250} maxSize={500} size={350}>
              <NoteList />
              <NoteContent />
            </SplitPane>
          </div>
        </SplitPane>
      </Container>
      <RenameNotebookModal />
    </div>    
  );
}

export default wrapComponent(Main);
