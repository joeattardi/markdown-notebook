import React from 'react';

import styled from 'styled-components';

const { remote } = window.require('electron');

const Container = styled.div`
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export default function Note({ active, note, onClick, onDelete }) {
  const contextMenu = remote.Menu.buildFromTemplate([
    {
      label: 'Delete',
      click: () => onDelete(note)
    }
  ]);

  function clickNote(event) {
    onClick(note);
  }

  function showMenu(event) {
    contextMenu.popup();
  }
  
  return (
    <Container className={active ? 'active' : ''} onClick={clickNote} onContextMenu={showMenu}>
      {note.title || 'Untitled'}
    </Container>
  );
}
