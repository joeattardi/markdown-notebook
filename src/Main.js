import React, { useContext } from 'react';

import SplitPane from 'react-split-pane';
import styled from 'styled-components';

import Header from './Header';
import NoteContent from './NoteContent';
import NoteList from './NoteList';
import Sidebar from './Sidebar';

import RenameNotebookModal from './RenameNotebookModal';

import { SET_RENAMING_NOTEBOOK } from './store/app';
import { RENAME_NOTEBOOK } from './store/notes';
import { App, Notes } from './store';

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
  const { currentNotebook } = useContext(Notes.State);
  const { isRenamingNotebook } = useContext(App.State);

  const appDispatch = useContext(App.Dispatch);
  const notesDispatch = useContext(Notes.Dispatch);

  function closeRenameModal() {
    appDispatch({ type: SET_RENAMING_NOTEBOOK, payload: false });
  }

  function renameNotebook(newName) {
    notesDispatch({ type: RENAME_NOTEBOOK, payload: newName });
    closeRenameModal();
  }

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
      <RenameNotebookModal
        onCancel={closeRenameModal}
        onSave={renameNotebook}
        currentNotebook={currentNotebook}
        isOpen={isRenamingNotebook} />
    </div>    
  );
}
