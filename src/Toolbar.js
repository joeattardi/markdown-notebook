import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { wrapComponent } from 'react-snackbar-alert';
import styled from 'styled-components';

import Button from './Button';
import ToggleButton from './ToggleButton';

import { Notes, App } from './store';

import { createNote, deleteNote, toggleEdit, insertImage } from './actions';

const Container = styled.div`
  button {
    font-size: 0.8rem;
  }
`;

function Toolbar({ createSnackbar }) {
  const { currentNotebook, currentNote, noteContent, cursorPosition } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  const { isEditing } = useContext(App.State);
  const appDispatch = useContext(App.Dispatch);

  function onClickNew() {
    createNote(notesDispatch, appDispatch, currentNotebook.name);
  }

  async function onClickEdit() {
    toggleEdit(appDispatch, isEditing, currentNote, noteContent);
  }

  function onClickDelete() {
    deleteNote(notesDispatch, createSnackbar, currentNote);
  }

  function onClickInsertImage() {
    insertImage(currentNotebook, noteContent, cursorPosition, notesDispatch);
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
      <Button variant="toolbar" data-tip="Insert image" onClick={onClickInsertImage} disabled={!currentNote || !isEditing}>
        <FontAwesomeIcon icon={faImage} />
      </Button>
    </Container>
  );
}

export default wrapComponent(Toolbar);
