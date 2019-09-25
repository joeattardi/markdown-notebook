import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

import Button from './Button';
import ToggleButton from './ToggleButton';

export default function Toolbar({ isEditing, onEditToggle, onNew }) {
  return (
    <div>
      <Button variant="toolbar" data-tip="New" onClick={onNew}>
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      <ToggleButton onClick={onEditToggle} variant={isEditing ? 'active' : 'toolbar'} title="Edit">
        <FontAwesomeIcon icon={faPencilAlt} />
      </ToggleButton>
    </div>
  );
}
