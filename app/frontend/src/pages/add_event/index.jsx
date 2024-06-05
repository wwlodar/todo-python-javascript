import {useState, useEffect} from "react";
import {Outlet} from "react-router-dom";
import {fastapiclient} from '../../client'
import InputForm from '../../components/InputForm'


const AddEventForm = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState({ title: '', date: ''});
  const [backendError, setBackendError] = useState('');
  let [isDisabled, setDisabledState] = useState(false);
  const [eventForm, setEventForm] =  useState({ title: '', date: ''});


  const onSendingEvent = (e) => {
    e.preventDefault();
    setLoading(true)
    {fastapiclient.createEvent(title, date)
    .then( (response) => {
      setEvents(response)})
    .catch( (err) => {
      setLoading(false)
      setBackendError(err);
    });


  const onInputChange = e => {
      const { name, value } = e.target;
      setEventForm(prev => ({
        ...prev,
        [name]: value
      }));
      validateInput(e);
    }

    const validateInput = e => {
      let { name, value } = e.target;
      setError(prev => {
        const stateObj = { ...prev, [name]: "" };

        switch (name) {
          case "title":
            if (!value) {
              stateObj["title"] = "Title cannot be empty";
              setDisabledState(true);}
            else {
              setDisabledState(false);
            }
            break;

          case "date":
            if (!value) {
              stateObj[name] = "Date cannot be empty";
              setDisabledState(true);
            }
            else {
              setDisabledState(false);
            }
            break;


          default:
            break;
        }

        return stateObj;
      });
    }


  }
  return (
  <form onSubmit={(e) => onSendingEvent(e)}>
        <InputForm
            type={"text"}
            name={"title"}
            label={"title"}
            required
            error={error.title}
            value={eventForm.title}
            onChange={onInputChange}
          />
          <InputForm
            type={"text"}
            name={"date"}
            label={"date"}
            required
            error={error.date}
            value={eventForm.date}
            onChange={onInputChange}
          />

        <button title={"Add event"} error={error} loading={loading} disabled={isDisabled} className={`rounded w-full mt-4 p-1`}>Add</button>
        <div>
        {(backendError !== '') &&
        <h1>{backendError.message}</h1>}
        </div>

  </form>)}}


const GetAllEvents = () => {
  return (
    <div className="App">
      <h2>AddEventForm</h2>

    </div>
  );
};

export default GetAllEvents;