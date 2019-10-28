import React from 'react';
import styled from 'styled-components';

import Toolbar from './Toolbar';

const Container = styled.header`
  background: ${({theme}) => theme.headerBackground};
  padding: 0.25rem;
  height: 2rem;
  line-height: 2rem;
  border-bottom: 1px solid #CCCCCC;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default function Header() {
  return (
    <Container>
      <Toolbar />
    </Container>
  );
}
