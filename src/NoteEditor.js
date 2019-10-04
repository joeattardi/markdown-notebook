import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { Controlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';

import { Notes } from './store';

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

export default function NoteEditor({ title, content, onChange, onTitleChange, onRename, onExitEdit }) {
  const editorRef = useRef(null);
  const { currentNote } = useContext(Notes.State);

  function onEditorChange(editor, data, value) {
    if (data.origin) {
      onChange(value);
    }
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

  useEffect(() => {
    editorRef.current.editor.focus();
    editorRef.current.editor.setCursor({ line: 0, ch: 0 });
  }, [currentNote]);
  
  return (
    <Container onKeyDown={onKeyDown}>
      <TitleInput
        value={title}
        placeholder="Enter a title..."
        onChange={event => onTitleChange(event.target.value)}
        onKeyDown={onTitleKeyDown}
        onBlur={onRename} />
      <CodeMirror
        ref={editorRef}
        onBeforeChange={onEditorChange}
        options={{
          mode: 'markdown'
        }}
        value={content} />
      </Container>
  );
}
