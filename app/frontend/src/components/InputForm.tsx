import React from 'react';


interface InputFormProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  error,
  required,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 300px', // label column wider, input fixed width
        alignItems: 'center',
        gap: '0.5rem 1rem',
        marginBottom: '1rem',
      }}
    >
      <label
        htmlFor={name}
        style={{ textAlign: 'right', paddingRight: '0.5rem', fontWeight: '600' }}
      >
        {label}
        {required && ' *'}
      </label>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            border: error ? '1px solid red' : '1px solid #ccc',
            borderRadius: '4px',
            width: '300px',  // fixed input width
            boxSizing: 'border-box', // ensure padding and border included
          }}
        />
        {error && (
          <span style={{ color: 'red', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
};


export default InputForm;
