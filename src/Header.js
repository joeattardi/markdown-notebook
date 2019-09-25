import React from 'react';
import styled from 'styled-components';

import Toolbar from './Toolbar';

const Container = styled.header`
  background: ${({theme}) => theme.headerBackground};
  padding: 0.5rem;
  height: 2rem;
  line-height: 2rem;
  border-bottom: 1px solid #CCCCCC;
`;

export default function Header({ isEditing, onEditToggle }) {
  return (
    <Container>
      <Toolbar isEditing={isEditing} onEditToggle={onEditToggle} />
    </Container>
  );
}