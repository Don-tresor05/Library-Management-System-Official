// src/components/FormComponents.jsx
import React from 'react';

export const FormGroup = ({ children }) => {
  return <div className="form-group">{children}</div>;
};

export const TextInput = ({ label, name, value, onChange, placeholder, required = false }) => {
  return (
    <FormGroup>
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-control"
      />
    </FormGroup>
  );
};

export const SelectInput = ({ label, name, value, onChange, options, required = false }) => {
  return (
    <FormGroup>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="form-control"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
};

export const SubmitButton = ({ text }) => {
  return (
    <button type="submit" className="btn btn-primary">
      {text}
    </button>
  );
};