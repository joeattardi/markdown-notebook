import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  padding: 0.5rem;
  height: 100%;
`;

export default function NoteList() {
  return (
    <Container>
      Note List
    </Container>
  );
}
