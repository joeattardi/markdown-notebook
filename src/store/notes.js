import React, { createContext, useReducer } from 'react';

import { sortBy } from '../util';

export const SET_NOTES = 'SET_NOTES';
export const SET_NOTEBOOKS = 'SET_NOTEBOOKS';
export const SET_CURRENT_NOTEBOOK = 'SET_CURRENT_NOTEBOOK';
export const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';
export const SET_NOTE_CONTENT = 'SET_NOTE_CONTENT';
export const ADD_NOTE = 'ADD_NOTE';

const State = createContext();
const Dispatch = createContext();

const initialState = {
  notebooks: [],
  currentNotebook: null,
  notes: [],
  currentNote: null,
  noteContent: ''
};

function reducer(state, action) {
  switch (action.type) {
    case SET_NOTEBOOKS:
      return {
        ...state,
        currentNotebook: action.payload[0],
        notebooks: action.payload
      };
    case SET_CURRENT_NOTEBOOK:
      return {
        ...state,
        currentNotebook: action.payload
      };
    case SET_NOTES:
      return {
        ...state,
        currentNote: action.payload[0],
        notes: action.payload
      };
    case SET_CURRENT_NOTE:
      return {
        ...state,
        currentNote: action.payload
      };
    case SET_NOTE_CONTENT:
      return {
        ...state,
        noteContent: action.payload
      };
    case ADD_NOTE:
      return {
        ...state,
        notes: sortBy([
          ...state.notes,
          action.payload
        ], 'filename'),
        currentNote: action.payload,
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === state.currentNotebook.id) {
            return {
              ...notebook,
              count: notebook.count + 1
            };
          }

          return notebook;
        })
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
  );
}

export const Notes = {
  State,
  Dispatch,
  Provider
};
