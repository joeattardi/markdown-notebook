import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import Notebook from './Notebook';

import { SET_CURRENT_NOTEBOOK, SET_NOTEBOOKS, SET_NOTES } from './store/notes';
import { Notes } from './store';

const { ipcRenderer } = window.require('electron');

const Container = styled.div`
  background: ${({theme}) => theme.sidebarBackground};
  color: #FFFFFF;
  height: 100%;
  user-select: none;

  h2 {
    margin: 0;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    padding: 0.25rem;
    text-transform: uppercase;
  }
`;

const NotebookList = styled.ul`
  margin: 0;
  padding: 0;
`;

const Toolbar = styled.div`
  display: flex;

  h2 {
    flex-grow: 1;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.5);
    outline: none;

    &:hover {
      color: #FFFFFF;
    }
  }
`;

export default function Sidebar({ onCreateNotebook, onDeleteNotebook }) {
  const { notebooks, currentNotebook } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  function onClickNotebook(notebook) {
    notesDispatch({ type: SET_CURRENT_NOTEBOOK, payload: notebook }); 
  }

  useEffect(() => {
    ipcRenderer.once('notebooks', (event, notebooks) => {
      notesDispatch({ type: SET_NOTEBOOKS, payload: notebooks });
    });

    ipcRenderer.send('getNotebooks');
  }, [notesDispatch]);

  useEffect(() => {
    if (currentNotebook) {
      ipcRenderer.once('notes', (event, notes) => {
        notesDispatch({ type: SET_NOTES, payload: notes });
      });

      ipcRenderer.send('getNotes', currentNotebook.name);
    }
  }, [notesDispatch, currentNotebook]);

  return (
    <Container>
      <Toolbar>
        <h2>Notebooks</h2>
        <button onClick={onCreateNotebook}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button onClick={onDeleteNotebook}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Toolbar>    
      <NotebookList>
        {notebooks.map(notebook => (
          <Notebook
            key={notebook.id}
            onClick={onClickNotebook}
            notebook={notebook}
            active={currentNotebook === notebook} />
        ))}
      </NotebookList>
    </Container>
  );
}
