import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

const { remote } = window.require('electron');

const Container = styled.li`
  list-style: none;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;

  &:hover {
    background: ${({theme}) => theme.sidebarHoverBackground};
  }

  &.active {
    background: ${({theme}) => theme.sidebarActiveBackground};
  }
`;

const Name = styled.div`
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.25rem;
`;

const Count = styled.div`
  font-weight: bold;
`;

export default function Notebook({ notebook, active, onClick, onRename, onDelete}) {
  const contextMenu = remote.Menu.buildFromTemplate([
    {
      label: 'Delete',
      click: () => onDelete(notebook)
    },
    {
      label: 'Rename',
      click: onRename
    }
  ]);

  function showMenu() {
    onClick(notebook);
    contextMenu.popup();
  }
  
  return (
    <Container className={active ? 'active' : ''} onClick={() => onClick(notebook)} title={notebook.name} onContextMenu={showMenu}>
      <Name><FontAwesomeIcon icon={faBook} style={{ marginRight: '0.25rem' }}/> {notebook.name}</Name>
      <Count>{notebook.count}</Count>
    </Container>
  );
}
