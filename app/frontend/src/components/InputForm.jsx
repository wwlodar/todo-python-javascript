import React from 'react';
import PropTypes from 'prop-types';

function InputForm({label, name, error, value, onChange, type = "text"}) {
  return  <div className="row justify-content-center">
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
InputForm.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
};
InputForm.defaultProps = {
  error: '',
  type: 'text',
};
export default InputForm;