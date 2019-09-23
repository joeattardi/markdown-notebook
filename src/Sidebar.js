import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: ${({theme}) => theme.sidebarBackground};
  color: #FFFFFF;
  padding: 0.5rem;
  width: 20rem;
`;

export default function Sidebar() {
  return (
    <Container>
      Sidebar
    </Container>
  );
}
