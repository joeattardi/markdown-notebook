import React from 'react';
import styled from 'styled-components';

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

export default function Sidebar({ currentNotebook, notebooks, onChangeNotebook }) {
  return (
    <Container>
      <h2>Notebooks</h2>
      <NotebookList>
        {notebooks.map(notebook => (
          <Notebook
            key={notebook.id}
            onClick={onChangeNotebook}
            notebook={notebook}
            active={currentNotebook === notebook} />
        ))}
      </NotebookList>
    </Container>
  );
}
