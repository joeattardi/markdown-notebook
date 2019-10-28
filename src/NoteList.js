import React, { useContext, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';

import Note from './Note';

import { showMessageBox } from './interactions';
import { createNote, getNote, saveNote, setCurrentNote } from './ipc';

import { deleteNote } from './actions';

import { actions as noteActions } from './store/notes';
import { actions as appActions } from './store/app';
import { App, Notes } from './store';

const Container = styled.div`
  border-right: 1px solid #CCCCCC;
  height: calc(100% - 3.25rem);
`;

export default function NoteList() {
  const { addToast } = useToasts();

  const { notes, currentNote, currentNotebook, noteContent } = useContext(Notes.State);
  const notesDispatch = useContext(Notes.Dispatch);

  const { isEditing } = useContext(App.State);
  const appDispatch = useContext(App.Dispatch);

  async function onClickNew() {
    try {
      const newNote = await createNote(currentNotebook.name);
      notesDispatch(noteActions.addNote(newNote));
      appDispatch(appActions.setEditing(true));
    } catch (error) {
      showMessageBox({
        type: 'error',
        message: 'Failed to create new note',
        detail: error.message
      });
    }
  }

  function onDeleteNote(note) {
    deleteNote(notesDispatch, addToast, note);
  }

  async function onClickNote(note) {
    if (isEditing) {
      try {
        await saveNote({
          ...currentNote,
          content: noteContent
        });
      } catch (error) {
        showMessageBox({
          type: 'error',
          message: 'Failed to save changes',
          detail: error.message
        });
      }
    }

    notesDispatch(noteActions.setCurrentNote(note));
  }

  useEffect(() => {
    setCurrentNote(currentNote);
  }, [currentNote]);

  useEffect(() => {
    async function setNoteContent() {
      if (currentNote) {
        try {
          const note = await getNote(currentNote.filename);
          notesDispatch(noteActions.setNoteContent(note.content));
          notesDispatch(noteActions.setNoteTitle(note.title));
        } catch (error) {
          showMessageBox({
            type: 'error',
            message: 'Failed to load note',
            detail: error.message
          });
        }
      } else {
        notesDispatch(noteActions.setNoteContent(''));
      }
    }

    setNoteContent();
  }, [notesDispatch, currentNote]);

  return (
    <Container>
      {notes && notes.length ? notes.map(note => (
        <Note
          active={currentNote.filename === note.filename}
          key={note.filename}
          note={note}
          onDelete={onDeleteNote}
          onClick={onClickNote} />
      )) : currentNotebook ? <NoNotesMessage onClickNew={onClickNew} /> : null}
    </Container>
  );
}

const StyledMessage = styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 1.1rem;
    margin: 0;
  }
`;

const NoNotesIcon = styled.div`
  font-size: 4rem;
  opacity: 0.2;
`;

const NewButton = styled.button`
  background: transparent;
  border: 1px solid ${({theme}) => theme.brandColor};
  color: ${({theme}) => theme.brandColor};
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 5px;
  font-weight: bold;

  &:hover {
    background: rgba(41, 78, 114, 0.25);
  }
`;

function NoNotesMessage({ onClickNew }) {
  return (
    <StyledMessage>
      <NoNotesIcon>
        <FontAwesomeIcon icon={faStickyNote} />
      </NoNotesIcon>
      <h3>There are no notes.</h3>
      <p>
        <NewButton onClick={onClickNew}>New Note</NewButton>
      </p>
    </StyledMessage>
  );
}
