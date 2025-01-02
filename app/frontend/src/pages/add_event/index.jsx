import React from 'react';
import {useState} from "react";
import {fastapiclient} from '../../client'
import InputForm from '../../components/InputForm'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

/**
 * AddEventForm component renders a form to add a new event with a title and date.
 *
 * State:
 * - error: An object containing error messages for the title and date fields.
 * - backendError: A string containing any error message returned from the backend.
 * - isDisabled: A boolean indicating whether the submit button should be disabled.
 * - title: A string representing the title of the event.
 * - date: A Date object representing the date of the event.
 *
 * Functions:
 * - onSendingEvent: Handles the form submission, sends the event data to the backend, and handles any errors.
 * - onInputChange: Handles changes to the input fields, updates the title state, and validates the input.
 * - validateInput: Validates the input fields and updates the error state and the disabled state of the submit button.
 *
 * Returns:
 * - A form with input fields for the title and date, a submit button, and error messages if any.
 */
const AddEventForm = () => {
  const [error, setError] = useState({ title: '', date: ''});
  const [backendError, setBackendError] = useState('');
  let [isDisabled, setDisabledState] = useState(true);
  const [title, setTitle] = useState('')
  // format to 2024-06-24T15:25:23+02:00
  const [date, setDate] = useState(new Date());



  const onSendingEvent = (e) => {
    console.log(title, date)
    e.preventDefault();

    {fastapiclient.createEvent(title, date.toISOString())
    .then( () => {})
    .catch( (err) => {
      setBackendError(err);
    }); }};


  const onInputChange = e => {
      const { name, value } = e.target;
      if (name === "title") {
        setTitle(value);
      }
      else if (name === "date") {
        setDate(value);
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
              console.log(date)
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
            value={title}
            onChange={onInputChange}
          />
            <DatePicker
            name="date"
            required
            placeholderText="Date"
            justify="center"
            dateFormat="yyyy-MM-dd"
            selected={date}
            onChange={onInputChange} />

        <button title={"Add event"} disabled={isDisabled} className={`rounded w-full mt-4 p-1`}>Add</button>
        <div>
        {backendError && <h1>{backendError.message}</h1>}
        </div>

    </form>
    );
  };}


const AddNewEvent = () => {
  return (
    <div className="App">
      <h2>Add New Event</h2>
      <a><AddEventForm/></a>

    </div>
  );
};

export default AddNewEvent;