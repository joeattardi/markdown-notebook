import React, { useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';

import { UnControlled as CodeMirror } from 'react-codemirror2';

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

export default function NoteEditor({ content, onChange }) {
  const editorRef = useRef(null);
  const { currentNote } = useContext(Notes.State);

  function onEditorChange(editor, data, value) {
    onChange(value);
  }

  useEffect(() => {
    editorRef.current.editor.focus();
    editorRef.current.editor.setCursor({ line: 0, ch: 0 });
  }, [currentNote]);
  
  return (
    <Container>
      <CodeMirror
        ref={editorRef}
        autoCursor={false}
        onChange={onEditorChange}
        options={{
          mode: 'markdown',
          autofocus: true
        }}
        value={content} />
      </Container>
  );
}
