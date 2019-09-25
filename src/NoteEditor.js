import React from 'react';

import { UnControlled as CodeMirror } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';

export default function NoteEditor({ content, onChange }) {
  function onEditorChange(editor, data, value) {
    onChange(value);
  }
  
  return (
    <CodeMirror
      autoCursor={false}
      onChange={onEditorChange}
      options={{
        mode: 'markdown'
      }}
      value={content} />
  );
}
