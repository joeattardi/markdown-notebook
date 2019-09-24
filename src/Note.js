import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-regular-svg-icons'
import styled from 'styled-components';

const Container = styled.div`
  padding: 0.3rem 0.5rem;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export default function Note({ note }) {
  return (
    <Container>
      <FontAwesomeIcon icon={faStickyNote} /> {note.title}
    </Container>
  );
}
