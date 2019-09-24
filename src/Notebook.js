import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components';

const Container = styled.li`
  list-style: none;
  padding: 0.3rem 0.5rem;
  cursor: pointer;

  &.active {
    background: ${({theme}) => theme.sidebarActiveBackground};
  }

  &:hover {
    background: ${({theme}) => theme.sidebarHoverBackground};
  }
`;

export default function Notebook({ name }) {
  return (
    <Container>
      <FontAwesomeIcon icon={faBook} /> {name}
    </Container>
  );
}
