import React, { createContext, useReducer } from 'react';

export const SET_EDITING = 'SET_EDITING';
export const TOGGLE_EDITING = 'TOGGLE_EDITING';
export const SET_RENAMING_NOTEBOOK = 'SET_RENAMING_NOTEBOOK';

const State = createContext();
const Dispatch = createContext();

const initialState = {
  isEditing: false,
  isRenamingNotebook: false
};

function reducer(state, action) {
  switch (action.type) {
    case TOGGLE_EDITING:
      return {
        ...state,
        isEditing: !state.isEditing
      };
    case SET_EDITING:
      return {
        ...state,
        isEditing: action.payload
      };
    case SET_RENAMING_NOTEBOOK:
      return {
        ...state,
        isRenamingNotebook: action.payload
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
