import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const { shell } = window.require('electron');

const Title = styled.h1`
  border-bottom: 1px solid #CCCCCC;
`;

export default function NoteView({ title, content }) {
  return (
    <div>
      <Title>{title || 'Untitled'}</Title>
      <ReactMarkdown
        source={content}
        renderers={{
          link: Link
        }}
      />
    </div>
  );
}

function Link({ href, children }) {
  function openLink(event) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }

  return (
    <a onClick={openLink} href={href}>{children}</a>
  );
}