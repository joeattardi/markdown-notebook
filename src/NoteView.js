import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const Title = styled.h1`
  border-bottom: 1px solid #CCCCCC;
`;

export default function NoteView({ title, content }) {
  return (
    <div>
      <Title>{title}</Title>
      <ReactMarkdown source={content} />
    </div>
  );
}
