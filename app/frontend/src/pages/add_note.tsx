import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { requireAuth } from '../utils/requireAuth';
import React, { useEffect, useState } from 'react';
import { fastapiclient } from '../client';
import InputForm from '../components/InputForm';
import DatePicker from 'react-datepicker';
import Router from 'next/router';
import "react-datepicker/dist/react-datepicker.css";

type Event = {
  title?: string;
  date?: string | Date;
  happened?: boolean;
  user_id?: string | number;
  event_id?: string | number;
};

type EventDisplayProps = {
  event?: Event;
};

const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
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
  const router  = Router;
  const [error, setError] = useState({ title: '', date: '' });
  const [backendError, setBackendError] = useState('');
  const [isDisabled, setDisabledState] = useState(true);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [createdEvent, setCreatedEvent] = useState(null);

  useEffect(() => {
    setBackendError('');
  }, [location.pathname]);

  // Validation helper to check if all inputs are valid
  const validateAll = (titleVal: string, dateVal: Date) => {
    return titleVal.trim().length > 0 && dateVal instanceof Date && !isNaN(dateVal);
  };

  const validateInput = (name: string, value: Date | string | null
  ) => {
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
      // Disable if any errors exist
      const hasError = Object.values(stateObj).some(msg => msg !== '');
      setDisabledState(hasError || !validateAll(name === 'title' ? value : title, name === 'date' ? value : date));
      return stateObj;
    });
  };

  const onInputChange = (name: string, value: Date | string
   ) => {
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'date') {
      setDate(value);
    }
    validateInput({ name, value });
  };

  const onSendingEvent = (e) => {
    e.preventDefault();
    setBackendError('');
    setCreatedEvent(null);
    fastapiclient.createEvent(title, date.toISOString())
      .then((response) => {
        setCreatedEvent(response);
      })
      .catch((err) => {
        setBackendError(err.response?.data || err.message || 'Unknown error');
      });
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
        onChange={(e) => onInputChange("title", e.target.value )}
      />
      <DatePicker
        name="date"
        label="Date"
        required
        placeholderText="Time & Date"
        dateFormat="yyyy-MM-dd  h:mm aa"
        selected={date}
        showTimeSelect
        timeIntervals={30}
        onChange={(date) => onInputChange("date", date )}
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

const AddNewEvent = () => (
  <div className="App">
    <h2>Add New Event</h2>
    <AddEventForm />
  </div>
);

export default AddNewEvent;