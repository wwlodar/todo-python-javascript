import React from 'react';

interface InputFormProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // optional error message
  required?: boolean; // optional boolean to indicate if the field is required
}

const InputForm: React.FC<InputFormProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  error,
  required,  // optional boolean
}) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}  // if undefined, native input treats as false; if true, enforces required
    />
    {error && <div style={{ color: 'red' }}>{error}</div>}
  </div>
);

export default InputForm;
