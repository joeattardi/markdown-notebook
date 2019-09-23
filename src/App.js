import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import Header from './Header';
import Sidebar from './Sidebar';

const theme = {
  headerBackground: '#EEEEEE',
  sidebarBackground: '#016FB0'
};

const Container = styled.div`
  display: flex;
  height: calc(100vh - 3rem);
`;

const Main = styled.main`
  padding: 0.5rem;
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <Container>
          <Sidebar />
          <Main>Main content</Main>
        </Container>
      </div>
    </ThemeProvider>
  );
}
