import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: ${({theme}) => theme.sidebarBackground};
  color: #FFFFFF;
  padding: 0.5rem;
  height: 100%;

  h1 {
    margin: 0;
    font-size: 1.2rem;
    text-align: center;
  }
`;

export default function Sidebar() {
  return (
    <Container>
      <h1>Markdown Notebook</h1>
    </Container>
  );
}
