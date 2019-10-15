import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const { clipboard, remote, shell } = window.require('electron');

const Title = styled.h1`
  border-bottom: 1px solid #CCCCCC;
`;

export default function NoteView({ title, content }) {
  const contextMenu = remote.Menu.buildFromTemplate([
    { role: 'copy' }
  ]);

  function showMenu() {
    contextMenu.popup();
  }
  
  return (
    <div onContextMenu={showMenu}>
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
  const contextMenu = remote.Menu.buildFromTemplate([
    { role: 'copy' },
    {
      label: 'Copy Link Address',
      click: () => clipboard.writeText(href)
    }
  ]);

  function openLink(event) {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }

  function showMenu(event) {
    event.stopPropagation();
    contextMenu.popup();
  }

  return (
    <a onClick={openLink} onContextMenu={showMenu} href={href}>{children}</a>
  );
}
