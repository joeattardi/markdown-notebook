import React, { createContext, useReducer } from 'react';

const SET_EDITING = 'SET_EDITING';
const TOGGLE_EDITING = 'TOGGLE_EDITING';
const SET_RENAMING_NOTEBOOK = 'SET_RENAMING_NOTEBOOK';

export const actions = {
  setEditing: isEditing => ({ type: SET_EDITING, payload: isEditing }),
  setRenamingNotebook: isRenamingNotebook => ({ type: SET_RENAMING_NOTEBOOK, payload: isRenamingNotebook }),
  toggleEditing: () => ({ type: TOGGLE_EDITING })
};

const State = createContext();
const Dispatch = createContext();

const initialState = {
  isEditing: false,
  isRenamingNotebook: false
};

function reducer(state, { type, payload }) {
  switch (type) {
    case TOGGLE_EDITING:
      return {
        ...state,
        isEditing: !state.isEditing
      };
    case SET_EDITING:
      return {
        ...state,
        isEditing: payload
      };
    case SET_RENAMING_NOTEBOOK:
      return {
        ...state,
        isRenamingNotebook: payload
      };
    default:
      return state;
  }
}

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <State.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </State.Provider>
  )
}

export const App = {
  State,
  Dispatch,
  Provider
};
