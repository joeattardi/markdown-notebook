import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { wrapComponent } from 'react-snackbar-alert';
import styled from 'styled-components';

import Button from './Button';
import ToggleButton from './ToggleButton';

import { SET_EDITING, TOGGLE_EDITING } from './store/app';
import { ADD_NOTE, DELETE_NOTE } from './store/notes';
import { Notes, App } from './store';

import { showMessageBox } from './interactions';
import { createNote, deleteNote } from './ipc';

const Container = styled.div`
  button {
    font-size: 0.8rem;
  }
`;

function Toolbar({ createSnackbar }) {
  const { currentNotebook, currentNote } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  const { isEditing } = useContext(App.State);
  const appDispatch = useContext(App.Dispatch);

  async function onClickNew() {
    try {
      const newNote = await createNote(currentNotebook.name);
      notesDispatch({ type: ADD_NOTE, payload: newNote });
      appDispatch({ type: SET_EDITING, payload: true });
    } catch (error) {
      showMessageBox({
        type: 'error',
        message: 'Failed to create new note',
        detail: error.message
      });
    }
  }

  function onClickEdit() {
    appDispatch({ type: TOGGLE_EDITING });
  }

  async function onClickDelete() {
    try {
      await deleteNote(currentNote.filename);
      notesDispatch({ type: DELETE_NOTE });
      createSnackbar({
        message: `Note "${currentNote.title}" was deleted.`,
        theme: 'success'
      });
    } catch (error) {
      showMessageBox({
        type: 'error',
        message: 'Failed to delete note',
        detail: error.message
      });
    }
  }

  return (
    <Container>
      <Button variant="toolbar" data-tip="New" onClick={onClickNew} disabled={!currentNotebook}>
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <ToggleButton onClick={onClickEdit} variant={isEditing ? 'active' : 'toolbar'} title="Edit" disabled={!currentNote}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </ToggleButton>
      <Button variant="toolbar" data-tip="Delete" onClick={onClickDelete} disabled={!currentNote}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </Container>
  );
}

export default wrapComponent(Toolbar);
