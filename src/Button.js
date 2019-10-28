import styled from 'styled-components';

const variants = {
  'default': {
    background: 'transparent',
    border: '#EEEEEE',
    color: '#000000'
  },
  toolbar: {
    background: '#FFFFFF',
    border: '#DDDDDD',
    color: '#000000'
  },
  active: {
    background: '#294E72',
    border: '#203E5B',
    color: '#FFFFFF'
  }
};

const Button = styled.button`
  background: ${({variant}) => variants[variant].background};
  border: 1px solid ${({variant}) => variants[variant].border};
  color: ${({variant}) => variants[variant].color};
  padding: 0.3rem 0.75rem;
  cursor: pointer;
  border-radius: 5px;
  outline: none;
  margin: 0 0.25rem;
  font-size: 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

Button.defaultProps = {
  variant: 'default'
};

export default Button;
