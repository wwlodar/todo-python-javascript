import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { requireAuth } from '../utils/auth';
import React, { useEffect, useState } from 'react';
import { fastapiclient } from '../client';
import InputForm from '../components/InputForm';
import DatePicker from 'react-datepicker';
import Router from 'next/router';
import "react-datepicker/dist/react-datepicker.css";

type Event = {
  title?: string;
  date?: string | Date ;
  happened?: boolean;
  user_id?: string | number;
  event_id?: string | number;
};

type EventDisplayProps = {
  event?: Event | null;
};

const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
  if (!event) return null;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleString()
    : 'No date provided';

  return (
    <div className="event-display">
      <h3>Created Event</h3>
      <p><strong>Title:</strong> {event.title}</p>
      <p><strong>Date:</strong> {formattedDate}</p>
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
  const [createdEvent, setCreatedEvent] = useState<Event | null>(null);

  useEffect(() => {
  setBackendError('');
}, [location.pathname]);

  const validateAll = (titleVal: string, dateVal: Date | null) => {
    return (
      titleVal.trim().length > 0 &&
      dateVal instanceof Date &&
      !isNaN(dateVal.getTime())
    );
  };

  const validateInput = (name: string, value: Date | string | null) => {
    setError(prev => {
      const stateObj = { ...prev, [name]: '' };

      if (name === 'title' && typeof value === 'string') {
        if (!value.trim()) {
          stateObj.title = "Title cannot be empty";
        }
      } else if (name === 'date') {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
          stateObj.date = "Date cannot be empty or invalid";
        }
      }

      const hasError = Object.values(stateObj).some(msg => msg !== '');

      // Use current values of title and date depending on which changed:
      const currentTitle = name === 'title' ? (value as string) : title;
      const currentDate = name === 'date' ? (value as Date | null) : date;

      setDisabledState(hasError || !validateAll(currentTitle, currentDate));
      return stateObj;
    });
  };

  const onInputChange = (name: string, value: Date | string | null
   ) => {
    if (name === 'title' && typeof value === 'string') {
      setTitle(value as string);
    } else if (name === 'date' && value instanceof Date) {
      setDate(value);
    }
    validateInput(name, value);
  };

  const onSendingEvent = (e: React.FormEvent<HTMLFormElement>) => {
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
        type="submit"
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