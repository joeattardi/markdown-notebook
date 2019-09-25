import React from 'react';

import Button from './Button';

export default function ToggleButton({ children, onClick, variant, title }) {
  return (
    <Button onClick={onClick} variant={variant} data-tip={title}>{children}</Button>
  );
}
