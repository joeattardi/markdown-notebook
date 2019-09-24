import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import Notebook from './Notebook';

const { ipcRenderer } = window.require('electron');

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

export default function Sidebar() {
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebook, setActiveNotebook] = useState(null);

  useEffect(() => {
    ipcRenderer.on('notebooks', (event, notebooks) => {
      setNotebooks(notebooks);
    });

    ipcRenderer.send('getNotebooks');
  }, []);

  function onClickNotebook(notebook) {
    setActiveNotebook(notebook.id);
    ipcRenderer.send('getNotes', notebook.name);
  }

  return (
    <Container>
      <h2>Notebooks</h2>
      <NotebookList>
        {notebooks.map(notebook => (
          <Notebook
            key={notebook.id}
            onClick={onClickNotebook}
            notebook={notebook}
            active={activeNotebook === notebook.id} />
        ))}
      </NotebookList>
    </Container>
  );
}
