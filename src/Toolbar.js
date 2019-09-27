import React, { useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import Button from './Button';
import ToggleButton from './ToggleButton';

import { SET_EDITING, TOGGLE_EDITING } from './store/app';
import { ADD_NOTE, DELETE_NOTE } from './store/notes';
import { Notes, App } from './store';

import { createNote, deleteNote } from './ipc';

export default function Toolbar() {
  const { currentNotebook, currentNote } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  const { isEditing } = useContext(App.State);
  const appDispatch = useContext(App.Dispatch);

  async function onClickNew() {
    const newNote = await createNote(currentNotebook.name);
    notesDispatch({ type: ADD_NOTE, payload: newNote });
    appDispatch({ type: SET_EDITING, payload: true });
  }

  function onClickEdit() {
    appDispatch({ type: TOGGLE_EDITING });
  }

  async function onClickDelete() {
    await deleteNote(currentNote.filename);
    notesDispatch({ type: DELETE_NOTE });
  }

  return (
    <div>
      <Button variant="toolbar" data-tip="New" onClick={onClickNew}>
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <ToggleButton onClick={onClickEdit} variant={isEditing ? 'active' : 'toolbar'} title="Edit" disabled={!currentNote}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </ToggleButton>
      <Button variant="toolbar" data-tip="Delete" onClick={onClickDelete} disabled={!currentNote}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
}
