import React from 'react';

const InputField = ({ value, onChange, placeholder }) => (
    <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
);

export default InputField;
