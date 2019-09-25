import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

import ToggleButton from './ToggleButton';

export default function Toolbar({ isEditing, onEditToggle }) {
  return (
    <div>
      <ToggleButton active={isEditing} onClick={onEditToggle}>
        <FontAwesomeIcon icon={faPencilAlt} />
      </ToggleButton>
    </div>
  );
}
