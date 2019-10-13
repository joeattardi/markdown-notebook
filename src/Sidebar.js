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

import { showMessageBox } from './interactions';
import * as ipc from './ipc';
import * as actions from './actions';

import { actions as appActions } from './store/app';
import { actions as noteActions } from './store/notes';
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
    notesDispatch(noteActions.setCurrentNotebook(notebook));
  }

  function onClickNew() {
    actions.createNotebook(notesDispatch);
  }

  function onClickDelete() {
    actions.deleteNotebook(notesDispatch, createSnackbar, notebooks, currentNotebook);
  }

  function onClickRename() {
    actions.renameNotebook(appDispatch);
  }

  useEffect(() => {
    async function getNotebooks() {
      try {
        const notebooks = await ipc.getNotebooks();
        notesDispatch(noteActions.setNotebooks(notebooks));
      } catch (error) {
        showMessageBox({
          type: 'error',
          message: 'Failed to load notebook list',
          detail: error.message
        });
      }
    }

    getNotebooks();
  }, [notesDispatch]);

  useEffect(() => {
    async function getNotes() {
      if (currentNotebook) {
        try {
          const notes = await ipc.getNotes(currentNotebook.name);
          notesDispatch(noteActions.setNotes(notes));
        } catch (error) {
          showMessageBox({
            type: 'error',
            message: 'Failed to load note list',
            detail: error.message
          });
        } finally {
          appDispatch(appActions.setLoading(false));
        }
      }
    }

    getNotes();
  }, [appDispatch, notesDispatch, currentNotebook]);

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
              onRename={onClickRename}
              onDelete={onClickDelete}
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
  font-size: 4rem;
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
  font-weight: bold;

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
