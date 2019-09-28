import React, { useState, useContext, useEffect, useRef } from 'react';

import styled from 'styled-components';
import Modal from 'styled-react-modal';

import Button from './Button';

import { SET_RENAMING_NOTEBOOK } from './store/app';
import { RENAME_NOTEBOOK } from './store/notes';
import { App, Notes } from './store';

import { showMessageBox } from './interactions';
import { renameNotebook } from './ipc';

const StyledModal = Modal.styled`
  width: 20rem;
  background: #FFFFFF;
  padding: 0.5rem;

  h1 {
    margin: 0;
    font-size: 1.3rem;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    font-size: 1.1rem;
    padding: 0.25rem;
    border-radius: 5px;
    border: 1px solid #CCCCCC;
  }
`;

const ButtonContainer = styled.div`
  text-align: right;
`;

const Content = styled.div`
  margin: 0.5rem 0;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.9rem;
`;

export default function RenameNotebookModal() {
  const { currentNotebook, notebooks } = useContext(Notes.State);
  const { isRenamingNotebook } = useContext(App.State);
  
  const notesDispatch = useContext(Notes.Dispatch);
  const appDispatch = useContext(App.Dispatch);

  const [nameValue, setNameValue] = useState(currentNotebook ? currentNotebook.name : '');

  function closeModal() {
    appDispatch({ type: SET_RENAMING_NOTEBOOK, payload: false });
  }

  function cancel() {
    closeModal();
    setNameValue(currentNotebook.name);
  }

  async function submitForm(event) {
    event.preventDefault();

    try {
      await renameNotebook(currentNotebook.name, nameValue);
      notesDispatch({ type: RENAME_NOTEBOOK, payload: nameValue });
    } catch (error) {
      showMessageBox({
        type: 'error',
        message: 'Failed to rename notebook',
        detail: error.message
      });
    }

    closeModal();
  }

  function isFormValid() {
    return !getErrorMessage();
  }

  function getErrorMessage() {
    if (!nameValue) {
      return 'Name is required.';
    }

    const notebookWithName = notebooks.find(notebook => notebook.name.toLowerCase() === nameValue.toLowerCase());
    if (notebookWithName && notebookWithName.id !== currentNotebook.id) {
      return 'A notebook already exists with that name.';
    }

    return null;
  }

  useEffect(() => {
    if (currentNotebook) {
      setNameValue(currentNotebook.name);
    }
  }, [currentNotebook]);

  const inputField = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (isRenamingNotebook) {
        inputField.current.select();
      }
    });
  }, [isRenamingNotebook]);
  
  return (
    <StyledModal isOpen={isRenamingNotebook} onEscapeKeydown={cancel}>
      <h1>Rename Notebook</h1>
      <ErrorMessage>{getErrorMessage() || <span>&nbsp;</span>}</ErrorMessage>
      <form onSubmit={submitForm}>
        <Content>
          <input
            value={nameValue}
            onChange={event => setNameValue(event.target.value)}
            ref={inputField} />
        </Content>
        <ButtonContainer>
          <Button type="button" onClick={cancel}>Cancel</Button>
          <Button type="submit" variant="active" disabled={!isFormValid()}>Save</Button>
        </ButtonContainer>
      </form>
    </StyledModal>
  );
}
