import React from 'react';

import SplitPane from 'react-split-pane';
import styled from 'styled-components';

import Header from './Header';
import NoteContent from './NoteContent';
import NoteList from './NoteList';
import Sidebar from './Sidebar';

import RenameNotebookModal from './RenameNotebookModal';

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

export default function Main() {
  return (
    <div>
      <Container>
        <SplitPane split="vertical" minSize={250} maxSize={500}>
          <Sidebar />
          <div>
            <Header />
            <SplitPane split="vertical" minSize={250} maxSize={500}>
              <NoteList />
              <NoteContent />
            </SplitPane>
          </div>
        </SplitPane>
      </Container>
      <RenameNotebookModal />
    </div>    
  );
}
