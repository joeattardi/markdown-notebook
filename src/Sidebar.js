import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import Notebook from './Notebook';

import * as ipc from './ipc';

import { SET_CURRENT_NOTEBOOK, SET_NOTEBOOKS, SET_NOTES, ADD_NOTEBOOK, DELETE_NOTEBOOK } from './store/notes';
import { Notes } from './store';

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

export default function Sidebar() {
  const { notebooks, currentNotebook } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  function onClickNotebook(notebook) {
    notesDispatch({ type: SET_CURRENT_NOTEBOOK, payload: notebook }); 
  }

  async function onClickNew() {
    const newNotebook = await ipc.createNotebook();
    notesDispatch({ type: ADD_NOTEBOOK, payload: newNotebook });
  }

  async function onClickDelete() {
    await ipc.deleteNotebook(currentNotebook.name);
    notesDispatch({ type: DELETE_NOTEBOOK });
  }

  useEffect(() => {
    async function getNotebooks() {
      const notebooks = await ipc.getNotebooks();
      notesDispatch({ type: SET_NOTEBOOKS, payload: notebooks });
    }

    getNotebooks();
  }, [notesDispatch]);

  useEffect(() => {
    async function getNotes() {
      if (currentNotebook) {
        const notes = await ipc.getNotes(currentNotebook.name);
        notesDispatch({ type: SET_NOTES, payload: notes });
      }
    }

    getNotes();
  }, [notesDispatch, currentNotebook]);

  return (
    <Container>
      <Toolbar>
        <h2>Notebooks</h2>
        <button onClick={onClickNew} data-tip="New Notebook">
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button onClick={onClickDelete} data-tip="Delete Notebook">
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
