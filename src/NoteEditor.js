import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';

import { Notes } from './store';

const { remote } = window.require('electron');

const Container = styled.div`
  height: calc(100% - 4.2rem);
  position: relative;

  .react-codemirror2 {
    height: 100%;
    position: relative;
  }

  .CodeMirror {
    height: 100%;
    font-size: 1.2rem;
  }
`;

const TitleInput = styled.input`
  font-size: 2rem;
  border: none;
  border-bottom: 1px solid #CCCCCC;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
  outline: none;
  padding: 0.5rem;
  font-family: monospace;
  font-weight: bold;

  &:focus {
    border-bottom-color: ${({theme}) => theme.brandColor};
  }
`;

export default function NoteEditor({ cursorPosition, title, content, onChange, onTitleChange, onCursorChange, onRename, onExitEdit }) {
  const contextMenu = remote.Menu.buildFromTemplate([
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' }
  ]);

  const editorRef = useRef(null);
  const { currentNote } = useContext(Notes.State);

  function onEditorChange(editor, data, value) {
    if (data.origin) {
      onChange(value);
    }
  }

  function afterEditorChange(editor, data, value) {
    if (!data.origin) {
      editor.setCursor(cursorPosition);
    }
  }

  function handleCursorChange(editor, data) {
    onCursorChange(editor.getCursor());
  }

  function onTitleKeyDown(event) {
    if (event.key === 'Enter') {
      onRename();
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onExitEdit();
    }
  }

  function showMenu() {
    contextMenu.popup();
  }

  useEffect(() => {
    editorRef.current.editor.focus();
    editorRef.current.editor.setCursor({ line: 0, ch: 0 });
  }, [currentNote]);
  
  return (
    <Container onKeyDown={onKeyDown} onContextMenu={showMenu}>
      <TitleInput
        value={title}
        placeholder="Enter a title..."
        onChange={event => onTitleChange(event.target.value)}
        onKeyDown={onTitleKeyDown}
        onBlur={onRename} />
      <CodeMirror
        ref={editorRef}
        onChange={afterEditorChange}
        onBeforeChange={onEditorChange}
        onCursor={handleCursorChange}
        options={{
          mode: 'markdown'
        }}
        value={content} />
      </Container>
  );
}
