import React from 'react';

import { App } from './app';
import { Notes } from './notes';

const providers = [<Notes.Provider />, <App.Provider />];

function Store({ children: initial }) {
  return providers.reduce((children, parent) => React.cloneElement(parent, { children }), initial);
}

export {
  Store,
  Notes,
  App
};
