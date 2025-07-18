import React, { useEffect, useState } from 'react';
import { fastapiclient } from '../../client';
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';

const EventDisplay = ({ event }) => {
  if (!event) return null;
  return (
    <div>
      <h4><strong>Title:</strong> {event.title}</h4>
      <p><strong>Event ID:</strong> {event.event_id}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString() }</p>
      <p><strong>Happened:</strong> {event.happened ? 'Yes' : 'No'}</p>
    </div>
  );
};
EventDisplay.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    happened: PropTypes.bool,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    event_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

const EventList = () => {
    // const location = useLocation();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [editingEventId, setEditingEventId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editingBackendError, setEditingBackendError] = useState('');

    const startEditing = (event) => {
      setEditingEventId(event.event_id);
      setEditedTitle(event.title);
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
    fastapiclient.getEvents("/events")
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
      typeof editingBackendError === 'string'
        ? editingBackendError
        : editingBackendError.detail || editingBackendError.message || 'Unknown error'
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


export default EventList;