import React from 'react';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';

import logo from './note.png';

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  position: absolute;
`;

export default function LoadingScreen() {
  return (
    <Container>
      <Logo src={logo} />
      <Loader type="Oval" color="#294E72" width={250} height={250} />
    </Container>
  );
}
