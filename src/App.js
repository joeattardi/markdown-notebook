import React from 'react';
import SplitPane from 'react-split-pane';
import styled, { ThemeProvider } from 'styled-components';

import Header from './Header';
import Sidebar from './Sidebar';

const theme = {
  headerBackground: '#EEEEEE',
  sidebarBackground: '#016FB0'
};

const Container = styled.div`
  height: 100vh;
  position: relative;

  .Resizer {
    position: relative;
    margin-left: -5px;
    width: 5px;
    cursor: ew-resize;
  }
`;

const Main = styled.main`
  padding: 0.5rem;
`;

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Container>
          <SplitPane split="vertical" minSize={250} maxSize={500}>
            <Sidebar />
            <div>
              <Header />
              <Main>Main content</Main>
            </div>
          </SplitPane>
        </Container>
      </div>
    </ThemeProvider>
  );
}
