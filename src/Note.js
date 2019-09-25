import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &.active {
    background: rgba(0, 0, 0, 0.15);
  }
`;

export default function Note({ active, note, onClick }) {
  return (
    <Container className={active ? 'active' : ''} onClick={() => onClick(note)}>
      {note.title}
    </Container>
  );
}
