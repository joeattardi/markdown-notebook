import React, { useContext, useEffect } from 'react';

import SplitPane from 'react-split-pane';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';

import LoadingScreen from './LoadingScreen';
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
  insertImage,
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

export default function Main() {
  const { addToast } = useToasts();

  const { currentNotebook, currentNote, cursorPosition, notebooks, noteContent, noteTitle } = useContext(Notes.State);
  const { isEditing, isLoading } = useContext(App.State);

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
      deleteNote(notesDispatch, addToast, currentNote);
    });
  }, [appDispatch, currentNote, addToast, notesDispatch]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:deleteNotebook');
    ipcRenderer.on('menu:deleteNotebook', () => {
      deleteNotebook(notesDispatch, addToast, notebooks, currentNotebook);
    })
  }, [notesDispatch, addToast, notebooks, currentNotebook]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:toggleEdit');
    ipcRenderer.on('menu:toggleEdit', async event => {
      toggleEdit(appDispatch, isEditing, currentNote, noteContent);
      renameNote(notesDispatch, currentNotebook, currentNote, noteContent, noteTitle);
    });
  }, [appDispatch, notesDispatch, isEditing, currentNote, noteContent, currentNotebook, noteTitle]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('menu:insertImage');
    ipcRenderer.on('menu:insertImage', () => {
      insertImage(currentNotebook, noteContent, cursorPosition, notesDispatch);
    });
  })

  return (
    <div>
      {isLoading ? <LoadingScreen /> : null}
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
