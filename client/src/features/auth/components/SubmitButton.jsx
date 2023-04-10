import React from "react";
import Loader from "./Loader";

const SubmitButton = ({ text, isLoading }) => {
  return (
    <div className="p-4">
      <button
        type="submit"
        disabled={isLoading ? true : false}
        className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-2 px-4 text-sm font-medium text-white hover:drop-shadow-md focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:from-blue-400 disabled:to-blue-600 disabled:text-slate-100 disabled:hover:drop-shadow-none"
      >
        {isLoading ? <Loader /> : text}
      </button>
    </div>
  );
};

export default SubmitButton;
