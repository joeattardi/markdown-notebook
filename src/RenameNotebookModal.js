import React, { useState, useEffect, useRef } from 'react';

import styled from 'styled-components';
import Modal from 'styled-react-modal';

import Button from './Button';

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
  margin: 0.5rem;
`;

export default function RenameNotebookModal({ isOpen, currentNotebook, onCancel, onSave }) {
  const [nameValue, setNameValue] = useState(currentNotebook ? currentNotebook.name : '');

  useEffect(() => setNameValue(currentNotebook ? currentNotebook.name : ''), [currentNotebook]);

  const inputField = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputField.current.focus();
      });
    }
  }, [isOpen]);

  return (
    <StyledModal isOpen={isOpen} onEscapeKeydown={onCancel}>
      <h1>Rename Notebook</h1>
      <Content>
        <input
          value={nameValue}
          onChange={event => setNameValue(event.target.value)}
          ref={inputField} />
      </Content>
      <ButtonContainer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="active" onClick={() => onSave(nameValue)}>Save</Button>
      </ButtonContainer>
    </StyledModal>
  );
}
