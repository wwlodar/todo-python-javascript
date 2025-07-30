import React, { useState, useEffect } from "react";
import { fastapiclient } from '../../client';

interface GetEventProps {
  id: number;
}

interface Event {
  title?: string;
  date?: string | Date;
  happened?: boolean;
  user_id?: string | number;
  event_id?: string | number;
}

const GetEvent: React.FC<GetEventProps> = ({ id }) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fastapiclient.getEventById(id)
      .then((response) => setEvent(response))
      .catch(() => setEvent(null)); // handle error by clearing event
  }, [id]);

  return (
    <div>
      <h3>Event Details</h3>
      {event ? (
        <div>
          <p><strong>Title:</strong> {event.title || "N/A"}</p>
          <p><strong>Date:</strong> {event.date ? new Date(event.date).toLocaleString() : "Unknown"}</p>
          <p><strong>Happened:</strong> {event.happened ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {event.user_id || "N/A"}</p>
          <p><strong>Event ID:</strong> {event.event_id || "N/A"}</p>
        </div>
      ) : (
        <p>No event found with ID: {id}</p>
      )}
    </div>
  );
};

export default GetEvent;
