import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import Notebook from './Notebook';

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

export default function Sidebar({ currentNotebook, notebooks, onChangeNotebook, onCreateNotebook, onDeleteNotebook }) {
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
            onClick={onChangeNotebook}
            notebook={notebook}
            active={currentNotebook && currentNotebook.id === notebook.id} />
        ))}
      </NotebookList>
    </Container>
  );
}
