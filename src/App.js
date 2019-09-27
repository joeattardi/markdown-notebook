import React from 'react';

import ReactTooltip from 'react-tooltip'
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ModalProvider } from 'styled-react-modal'

import Main from './Main';

import { Store } from './store';

const theme = {
  headerBackground: '#EEEEEE',
  sidebarBackground: '#294E72',
  sidebarHoverBackground: 'rgba(255, 255, 255, 0.2)',
  sidebarActiveBackground: 'rgba(0, 0, 0, 0.2)'
};

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', sans-serif;
  }
`;

export default function App() {
  return (
    <Store>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <GlobalStyle />
          <ReactTooltip effect="solid" delayShow={250} />
          <Main />
        </ModalProvider>
      </ThemeProvider>
    </Store>
  );
}
