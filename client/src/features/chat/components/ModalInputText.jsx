import React from "react";

const ModalInputText = ({ value, onChange, label, name, id }) => {
  return (
    <div className="">
      <label htmlFor={id} className="block text-sm text-gray-500">
        {label}
      </label>
      <div className="mt-2.5">
        <input
          type="text"
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="form-input block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default ModalInputText;
