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
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 3px;
  outline: none;
`;

Button.defaultProps = {
  variant: 'default'
};

export default Button;
