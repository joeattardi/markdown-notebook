import React, { useRef, useEffect } from 'react';

import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';

export default function NoteEditor({ content, onChange }) {
  const editorRef = useRef(null);

  function onEditorChange(editor, data, value) {
    onChange(value);
  }

  useEffect(() => {
    editorRef.current.editor.focus();
    editorRef.current.editor.setCursor({ line: 0, ch: 0 });
  }, []);
  
  return (
    <CodeMirror
      ref={editorRef}
      autoFocus={true}
      autoCursor={false}
      onChange={onEditorChange}
      options={{
        mode: 'markdown',
        autofocus: true
      }}
      value={content} />
  );
}
