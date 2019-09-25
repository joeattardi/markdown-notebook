import styled from 'styled-components';

export default styled.button`
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  border-radius: 3px;

  &.active {
    background: blue;
    color: white;
  }
`;
