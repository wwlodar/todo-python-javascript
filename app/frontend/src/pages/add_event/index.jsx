import {useState, useEffect} from "react";
import {Outlet} from "react-router-dom";
import {fastapiclient} from '../../client'
import InputForm from '../../components/InputForm'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const AddEventForm = () => {
  const [error, setError] = useState({ title: '', date: ''});
  const [backendError, setBackendError] = useState('');
  let [isDisabled, setDisabledState] = useState(false);
  const [eventForm, setEventForm] =  useState({ title: '', date: new Date()});



  const onSendingEvent = (e) => {
    e.preventDefault();
    {fastapiclient.createEvent(eventForm.title, eventForm.date)
    .then( () => {})
    .catch( (err) => {
      setBackendError(err);
    }); }};


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
          <DatePicker
  selected={eventForm.date}
  onChange={onInputChange}
  value={eventForm.date}
  required
/>

        <button title={"Add event"} error={error} disabled={isDisabled} className={`rounded w-full mt-4 p-1`}>Add</button>
        <div>
        {(backendError !== '') &&
        <h1>{backendError.message}</h1>}
        </div>

  </form>) }


const AddNewEvent = () => {
  return (
    <div className="App">
      <h2>Add New Event</h2>
      <a><AddEventForm/></a>

    </div>
  );
};

export default AddNewEvent;