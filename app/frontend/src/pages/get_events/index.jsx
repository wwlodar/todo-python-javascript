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
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
    fastapiclient.getEvents("/events")
      .then(response => {
        setEvents(response);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data || err.message || "Error loading events");
        setLoading(false);
      });
  }, []);

    return (
      <div className="App">
        <h2><a>Your events</a></h2>
        {events.length === 0 && <p>No events found.</p>}
        {error && <p className="text-danger">{error.detail}</p>}
        <div className="event-list">
          {events.map(event => (
            <EventDisplay key={event.event_id} event={event} />
          ))}


      </div>
      </div>
    );

}


export default EventList;