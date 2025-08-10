import React, { useEffect, useState } from 'react';
import { fastapiclient } from '../client';
import InputForm from '../components/InputForm';

type Note = {
  title?: string;
  date?: string | Date;
  done?: boolean;
  user_id?: string | number;
  note_id?: string | number;
};

type NoteDisplayProps = {
  note?: Note | null;
};

const NoteDisplay: React.FC<NoteDisplayProps> = ({ note }) => {
  if (!note) return null;

  const formattedDate = note.date
    ? new Date(note.date).toLocaleString()
    : 'No date provided';

  return (
    <div className="note-display">
      <h3>Created Note</h3>
      <p><strong>Title:</strong> {note.title}</p>
      <p><strong>Date added:</strong> {formattedDate}</p>
      <p><strong>Done:</strong> {note.done ? 'Yes' : 'No'}</p>
      <p><strong>Note ID:</strong> {note.note_id}</p>
    </div>
  );
};

const AddNoteForm = () => {
  const [error, setError] = useState({ title: '' });
  const [backendError, setBackendError] = useState('');
  const [isDisabled, setDisabledState] = useState(true);
  const [title, setTitle] = useState('');
  const [createdNote, setCreatedNote] = useState<Note | null>(null);

  useEffect(() => {
    setBackendError('');
  }, []);

  const validateAll = (titleVal: string) => {
    return titleVal.trim().length > 0;
  };

  const validateInput = (name: string, value: string) => {
    setError(prev => {
      const stateObj = { ...prev, [name]: '' };

      if (name === 'title') {
        if (!value || value.trim() === '') {
          stateObj.title = "Title cannot be empty";
        }
      }

      const hasError = Object.values(stateObj).some(msg => msg !== '');
      setDisabledState(hasError || !validateAll(name === 'title' ? value : title));
      return stateObj;
    });
  };

  const onInputChange = (name: string, value: string) => {
    if (name === 'title') {
      setTitle(value);
    }
    validateInput(name, value);
  };

  const onSendingNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackendError('');
    setCreatedNote(null);

    try {
      // Use current date/time here:
      const now = new Date().toISOString();

      const response = await fastapiclient.createNote(title, now);
      setCreatedNote(response);
    } catch (err: any) {
      setBackendError(err.response?.data || err.message || 'Unknown error');
    }
  };

  return (
    <form onSubmit={onSendingNote}>
      <InputForm
        type="text"
        name="title"
        label="Title"
        required
        error={error.title}
        value={title}
        onChange={(e) => onInputChange("title", e.target.value)}
      />

      <button
        title="Add note"
        type="submit"
        disabled={isDisabled}
        className="rounded w-full mt-4 p-1"
      >
        Add
      </button>

      <div>
        {backendError && <h3 className="error-message">{backendError}</h3>}
        <NoteDisplay note={createdNote} />
      </div>
    </form>
  );
};

const AddNewNote = () => (
  <div className="App">
    <h2>Add New Note</h2>
    <AddNoteForm />
  </div>
);

export default AddNewNote;
