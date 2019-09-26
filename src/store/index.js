import React from 'react';

import { Notes } from './notes';

const providers = [<Notes.Provider />];

function Store({ children: initial }) {
  return providers.reduce((children, parent) => React.cloneElement(parent, { children }), initial);
}

export {
  Store,
  Notes
};
