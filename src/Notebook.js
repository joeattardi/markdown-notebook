import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

const Container = styled.li`
  list-style: none;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: ${({theme}) => theme.sidebarHoverBackground};
  }

  &.active {
    background: ${({theme}) => theme.sidebarActiveBackground};
  }
`;

export default function Notebook({ notebook, active, onClick }) {
  return (
    <Container className={active ? 'active' : ''} onClick={() => onClick(notebook)}>
      <FontAwesomeIcon icon={faBook} /> {notebook.name}
    </Container>
  );
}
