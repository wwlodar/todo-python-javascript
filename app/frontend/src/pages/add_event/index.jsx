import {useState, useEffect} from "react";
import {Outlet} from "react-router-dom";
import {fastapiclient} from '../../client'


const GetEvent = ({id}) => {
  const [events, setEvents] = useState([]);
  const eventId = id

  useEffect(() => {fastapiclient.getEventById(eventId)
      .then((response) => setEvents(response));
  }, []);

  return (<a>{events}</a>
  );
}


const Layout = () => {
  return (
    <div className="App">
      <h2>Event</h2>

      <a>1: <GetEvent id='1' /></a>
      <p></p>
      <a>2: <GetEvent id='2'/></a>
      <Outlet />
    </div>
  );
};

export default Layout;