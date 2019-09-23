import React from 'react';
import styled from 'styled-components';

const Container = styled.header`
  background: ${({theme}) => theme.headerBackground};
  padding: 0.5rem;
`;

export default function Header() {
  return (
    <Container>
      Header
    </Container>
  );
}
