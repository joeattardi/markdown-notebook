import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faPlus,
  faTrash,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { wrapComponent } from 'react-snackbar-alert';

import Notebook from './Notebook';

import * as ipc from './ipc';

import {
  SET_CURRENT_NOTEBOOK,
  SET_NOTEBOOKS,
  SET_NOTES,
  ADD_NOTEBOOK,
  DELETE_NOTEBOOK
} from './store/notes';
import { SET_RENAMING_NOTEBOOK } from './store/app';
import { App, Notes } from './store';

const Container = styled.div`
  background: ${({ theme }) => theme.sidebarBackground};
  color: #ffffff;
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
      color: #ffffff;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
`;

function Sidebar({ createSnackbar }) {
  const { notebooks, currentNotebook } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  const appDispatch = useContext(App.Dispatch);

  function onClickNotebook(notebook) {
    notesDispatch({ type: SET_CURRENT_NOTEBOOK, payload: notebook });
  }

  async function onClickNew() {
    const newNotebook = await ipc.createNotebook();
    notesDispatch({ type: ADD_NOTEBOOK, payload: newNotebook });
  }

  async function onClickDelete() {
    const confirm = await ipc.confirmDeleteNotebook(currentNotebook.name);
    if (confirm) {
      await ipc.deleteNotebook(currentNotebook.name);
      notesDispatch({ type: DELETE_NOTEBOOK });
      createSnackbar({
        message: `Notebook "${currentNotebook.name}" was deleted.`,
        theme: 'success'
      });

      if (notebooks.length === 1) { // we deleted the last notebook
        notesDispatch({ type: SET_NOTES, payload: [] });
      }
    }
  }

  function onClickRename() {
    appDispatch({ type: SET_RENAMING_NOTEBOOK, payload: true });
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
        <button
          onClick={onClickRename}
          data-tip="Rename Notebook"
          disabled={!notebooks.length}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
        <button
          onClick={onClickDelete}
          data-tip="Delete Notebook"
          disabled={!notebooks.length}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </Toolbar>
      {notebooks && notebooks.length ? (
        <NotebookList>
          {notebooks.map(notebook => (
            <Notebook
              key={notebook.id}
              onClick={onClickNotebook}
              notebook={notebook}
              active={currentNotebook.id === notebook.id}
            />
          ))}
        </NotebookList>
      ) : (
        <NoNotebooksMessage onClickNew={onClickNew} />
      )}
    </Container>
  );
}

const StyledMessage = styled.div`
  text-align: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 1.1rem;
    margin: 0;
  }
`;

const NoNotebooksIcon = styled.div`
  font-size: 1.5rem;
  opacity: 0.2;
`;

const NewButton = styled.button`
  background: transparent;
  border: 1px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 5px;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

function NoNotebooksMessage({ onClickNew }) {
  return (
    <StyledMessage>
      <NoNotebooksIcon>
        <FontAwesomeIcon icon={faBook} />
      </NoNotebooksIcon>
      <h3>There are no notebooks.</h3>
      <p>
        <NewButton onClick={onClickNew}>New Notebook</NewButton>
      </p>
    </StyledMessage>
  );
}

export default wrapComponent(Sidebar);
