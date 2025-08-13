import React, { useEffect, useState } from 'react';
import { fastapiclient } from '../client';
import "react-datepicker/dist/react-datepicker.css";

import { requireAuth } from '../utils/auth';  // import your requireAuth wrapper

const EventListPage = () => <EventList />;

interface Event {
  title?: string;
  date?: string | Date;
  happened?: boolean;
  user_id?: string | number;
  event_id?: string | number;
}

interface EventDisplayProps {
  event?: Event;
}

const EventDisplay: React.FC<EventDisplayProps> = ({ event }) => {
  if (!event) return null;

  return (
    <div>
      <h4><strong>Title:</strong> {event.title}</h4>
      <p><strong>Event ID:</strong> {event.event_id}</p>
      <p>
        <strong>Date:</strong>{' '}
        {event.date ? new Date(event.date).toLocaleString() : 'No date'}
      </p>
      <p><strong>Happened:</strong> {event.happened ? 'Yes' : 'No'}</p>
    </div>
  );
};

const EventList = () => {
    // const location = useLocation();
    const [events, setEvents] = useState<Event[]>([]);
    const [editingEventId, setEditingEventId] = useState<string | number | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [error, setError] = useState<any>(null);
    const [editingBackendError, setEditingBackendError] = useState<string | null>('');

    const startEditing = (event: Event) => {
      if (event.event_id !== undefined) {
        setEditingEventId(event.event_id);
      } else {
        setEditingEventId(null); // fallback
      }
      setEditedTitle(event.title || "");
      setEditingBackendError('');
    };



    const saveEventTitle = () => {
      fastapiclient.updateEvent(editedTitle, editingEventId)
        .then((response) => {
          console.log(response)
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.event_id === editingEventId
                ? { ...event, title: editedTitle } // update 'title', not 'name'
                : event
            )
          );
          setEditingEventId(null);
          setEditedTitle("");
          setEditingBackendError('');
        })
        .catch((err) => {
          setEditingBackendError(
            err.response?.data?.detail || err.message || "Unknown error"
          );
        });
    };

    const cancelEditing = () => {
      setEditingEventId(null);
      setEditedTitle("");
    };


  useEffect(() => {
    fastapiclient.getEvents()
      .then(response => {
        setEvents(response);
      })
      .catch(err => {
        setError(err.response?.data || err.message || "Error loading events");
      });
  }, []);

    return (
      <div className="App">
        <h2><a>Your events</a></h2>
        {events.length === 0 && <p>No events found.</p>}
        {error && <p className="text-danger">{error.detail}</p>}
        <div className="event-list">
        {events.map((event) => (
          <div key={event.event_id} style={{ marginBottom: "1rem" }}>
            <EventDisplay event={event} />

            {editingEventId === event.event_id ? (
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button onClick={saveEventTitle}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
                {editingBackendError && (
  <p className="text-danger" style={{ marginTop: '0.5rem' }}>
    {
        editingBackendError.detail || editingBackendError.message || 'Unknown error'
    }
  </p>)}
              </div>
            ) : (
              <button onClick={() => startEditing(event)}>Update</button>
            )}
          </div>
        ))}
      </div>
    </div>
    );

}


export const getServerSideProps = requireAuth(async (context) => {
    // This function will run on the server side before rendering the page

  return {
    props: {},
  };
});

export default EventListPage;
