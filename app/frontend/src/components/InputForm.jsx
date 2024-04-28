import React from 'react';

function InputForm({label, name, error, value, onChange, type = "text"}) {
  return <div>
            <label className="form-label mt-4 " htmlFor={name}>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`form-contol rounded w-full p-2 border-b-2 ${!error ? "mb-6 border-teal-500 " : "border-red-500 "} text-teal-700 outline-none focus:bg-gray-300`}
            />
            <div>{error && <span className='mb-3 text-red-500' >{error}</span>}</div>

        </div>
}

export default InputForm;