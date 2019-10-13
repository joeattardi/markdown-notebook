import React, { createContext, useReducer } from 'react';
import slugify from 'slugify';

import { sortBy } from '../util';

const SET_NOTES = 'SET_NOTES';
const SET_NOTEBOOKS = 'SET_NOTEBOOKS';
const SET_CURRENT_NOTEBOOK = 'SET_CURRENT_NOTEBOOK';
const SET_CURRENT_NOTE = 'SET_CURRENT_NOTE';
const SET_NOTE_CONTENT = 'SET_NOTE_CONTENT';
const SET_NOTE_TITLE = 'SET_NOTE_TITLE';
const ADD_NOTE = 'ADD_NOTE';
const DELETE_NOTE = 'DELETE_NOTE';
const RENAME_NOTE = 'RENAME_NOTE';
const ADD_NOTEBOOK = 'ADD_NOTEBOOK';
const DELETE_NOTEBOOK = 'DELETE_NOTEBOOK';
const RENAME_NOTEBOOK = 'RENAME_NOTEBOOK';

export const actions = {
  setNotes: notes => ({ type: SET_NOTES, payload: notes }),
  setNotebooks: notebooks => ({ type: SET_NOTEBOOKS, payload: notebooks }),
  setCurrentNotebook: currentNotebook => ({ type: SET_CURRENT_NOTEBOOK, payload: currentNotebook }),
  setCurrentNote: currentNote => ({ type: SET_CURRENT_NOTE, payload: currentNote }),
  setNoteContent: noteContent => ({ type: SET_NOTE_CONTENT, payload: noteContent }),
  setNoteTitle: title => ({ type: SET_NOTE_TITLE, payload: title }),
  addNote: note => ({ type: ADD_NOTE, payload: note }),
  deleteNote: note => ({ type: DELETE_NOTE, payload: note }),
  renameNote: name => ({ type: RENAME_NOTE, payload: name }),
  addNotebook: notebook => ({ type: ADD_NOTEBOOK, payload: notebook }),
  deleteNotebook: notebook => ({ type: DELETE_NOTEBOOK, payload: notebook }),
  renameNotebook: name => ({ type: RENAME_NOTEBOOK, payload: name })
};

const State = createContext();
const Dispatch = createContext();

const initialState = {
  notebooks: [],
  currentNotebook: null,
  notes: [],
  currentNote: null,
  noteContent: '',
  noteTitle: ''
};

function reducer(state, { type, payload }) {
  switch (type) {
    case SET_NOTEBOOKS:
      return {
        ...state,
        currentNotebook: payload[0],
        notebooks: payload
      };
    case SET_CURRENT_NOTEBOOK:
      return {
        ...state,
        currentNotebook: payload
      };
    case SET_NOTES:
      return {
        ...state,
        currentNote: payload[0],
        notes: payload
      };
    case SET_CURRENT_NOTE:
      return {
        ...state,
        currentNote: payload,
        noteTitle: payload.title
      };
    case SET_NOTE_CONTENT:
      return {
        ...state,
        noteContent: payload
      };
    case ADD_NOTE:
      return {
        ...state,
        notes: sortBy([
          ...state.notes,
          payload
        ], 'title'),
        currentNote: payload,
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
    case DELETE_NOTE:
      const currentNoteIndex = state.notes.findIndex(note => note.filename === payload.filename);

      return {
        ...state,
        notes: state.notes.filter(note => note.filename !== payload.filename),
        notebooks: state.notebooks.map(notebook => {
          if (notebook.id === state.currentNotebook.id) {
            return {
              ...notebook,
              count: notebook.count - 1
            };
          }

          return notebook;
        }),
        currentNote: payload.filename === state.currentNote.filename ? currentNoteIndex === state.notes.length - 1 ? state.notes[currentNoteIndex - 1] : state.notes[currentNoteIndex + 1] : state.currentNote
      };
      case SET_NOTE_TITLE:
        return {
          ...state,
          noteTitle: payload
        };
      case RENAME_NOTE:
        return {
          ...state,
          notes: sortBy(state.notes.map(note => {
            if (note.filename === state.currentNote.filename) {
              return {
                ...note,
                ...payload,
                id: slugify(payload.title).toLowerCase()
              };
            }

            return note;
          }), 'title'),
          currentNote: {
            ...state.currentNote,
            ...payload,
            id: slugify(payload.title).toLowerCase()
          }
        };
      case ADD_NOTEBOOK:
        return {
          ...state,
          notebooks: sortBy([
            ...state.notebooks,
            payload
          ], 'name'),
          currentNotebook: payload
        };
      case DELETE_NOTEBOOK:
        if (payload.id === state.currentNotebook.id) {
          const currentNotebookIndex = state.notebooks.findIndex(notebook => notebook.id === payload.id);
          return {
            ...state,
            notebooks: state.notebooks.filter(notebook => notebook.id !== payload.id),
            currentNotebook: currentNotebookIndex === state.notebooks.length - 1 ? state.notebooks[currentNotebookIndex - 1] : state.notebooks[currentNotebookIndex + 1]
          };
        }

        return {
          ...state,
          notebooks: state.notebooks.filter(notebook => notebook.id !== payload.id)
        };
      case RENAME_NOTEBOOK:
        return {
          ...state,
          notebooks: sortBy(state.notebooks.map(notebook => {
            if (notebook.id === state.currentNotebook.id) {
              return { 
                ...notebook, 
                name: payload,
                id: slugify(payload)
              }
            }
            return notebook;
          }), 'name'),
          currentNotebook: {
            ...state.currentNotebook,
            name: payload,
            id: slugify(payload)
          }
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
