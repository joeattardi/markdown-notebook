import React from 'react';

import Button from './Button';

export default function ToggleButton({ active, children, onClick }) {
  return (
    <Button onClick={onClick} className={active ? 'active' : ''}>{children}</Button>
  );
}
