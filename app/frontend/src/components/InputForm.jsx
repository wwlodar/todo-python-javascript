import React from 'react';
import inputlabel from '../components/css/inputForm.css'

function InputForm({label, name, error, value, onChange, type = "text"}) {
  return  <div class="row">
            <inputlabel className="col-form-label col-sm-2" htmlFor={name}>{label}</inputlabel>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`form-contol rounded col-sm-2 border-b-4 p-2 ${!error ? "border-teal-500 " : "border-red-500 "} text-teal-700 outline-none focus:bg-gray-300`}
            />
            <div>{error && <span className='mb-3 text-red-500' >{error}</span>}</div>

        </div>
}

export default InputForm;