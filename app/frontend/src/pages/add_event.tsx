// pages/add_event.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import InputForm from '../components/InputForm';
import { fastapiclient } from '../client';
import ProtectedRoute from '../components/ProtectedRoute';

const EventDisplay = ({ event }) => {
  if (!event) return null;
  return (
    <div className="event-display">
      <h3>Created Event</h3>
      <p><strong>Title:</strong> {event.title}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Happened:</strong> {event.happened ? 'Yes' : 'No'}</p>
      <p><strong>Event ID:</strong> {event.event_id}</p>
    </div>
  );
};

const AddEventForm = () => {
  const router = useRouter();
  const [error, setError] = useState({ title: '', date: '' });
  const [backendError, setBackendError] = useState('');
  const [isDisabled, setDisabledState] = useState(true);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [createdEvent, setCreatedEvent] = useState(null);

  useEffect(() => {
    setBackendError('');
  }, [router.pathname]);

  const validateAll = (titleVal, dateVal) => {
    return titleVal.trim().length > 0 && dateVal instanceof Date && !isNaN(dateVal.getTime());
  };

  const validateInput = ({ name, value }) => {
    setError(prev => {
      const stateObj = { ...prev, [name]: '' };

      if (name === "title") {
        if (!value || value.trim() === '') {
          stateObj.title = "Title cannot be empty";
        }
      } else if (name === "date") {
        if (!value) {
          stateObj.date = "Date cannot be empty";
        }
      }

      const hasError = Object.values(stateObj).some(msg => msg !== '');
      setDisabledState(hasError || !validateAll(name === 'title' ? value : title, name === 'date' ? value : date));
      return stateObj;
    });
  };

  const onInputChange = ({ name, value }) => {
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'date') {
      setDate(value);
    }
    validateInput({ name, value });
  };

  const onSendingEvent = async (e) => {
    e.preventDefault();
    setBackendError('');
    setCreatedEvent(null);
    try {
      const response = await fastapiclient.createEvent(title, date.toISOString());
      setCreatedEvent(response);
    } catch (err) {
      setBackendError(err.response?.data || err.message || 'Unknown error');
    }
  };

  return (
    <form onSubmit={onSendingEvent}>
      <InputForm
        type="text"
        name="title"
        label="Title"
        required
        error={error.title}
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange({ name: "title", value: e.target.value })}
      />
      <DatePicker
        name="date"
        required
        placeholderText="Time & Date"
        dateFormat="yyyy-MM-dd  h:mm aa"
        selected={date}
        showTimeSelect
        timeIntervals={30}
        onChange={(date: Date | null) => onInputChange({ name: "date", value: date })}
      />

      <button
        title="Add event"
        disabled={isDisabled}
        className="rounded w-full mt-4 p-1"
      >
        Add
      </button>

      <div>
        {backendError && <h3 className="error-message">{backendError}</h3>}
        <EventDisplay event={createdEvent} />
      </div>
    </form>
  );
};

export default AddEventForm;