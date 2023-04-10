import React from "react";

const Badge = ({ name, setParticipants }) => {
  const removeBadge = (badge) => {
    setParticipants((prevPart) => {
      return prevPart.filter((p) => {
        return p.email !== badge;
      });
    });
  };

  return (
    <span
      id="badge-dismiss-default"
      className="inline-flex items-center pl-2 pr-1 py-0.5 mr-1 text-xs font-medium text-blue-800 bg-blue-100 rounded mt-1"
    >
      {name}
      <button
        type="button"
        className="inline-flex items-center ml-2 text-xs text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900"
        data-dismiss-target="#badge-dismiss-default"
        aria-label="Remove"
        onClick={() => removeBadge(name)}
      >
        <svg
          aria-hidden="true"
          className="w-3 h-3"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        <span className="sr-only">Remove badge</span>
      </button>
    </span>
  );
};

export default Badge;
