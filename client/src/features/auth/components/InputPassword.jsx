import React from "react";

const InputPassword = (props) => {
  const { name, label, id, value, onChange } = props;

  return (
    <div className="p-4">
      <label
        htmlFor={id}
        className="block text-sm font-semibold leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2.5">
        <input
          type="password"
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          className="form-input block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default InputPassword;
