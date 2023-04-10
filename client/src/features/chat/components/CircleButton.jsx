import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CircleButton = ({ icon, onClick }) => {
  return (
    <button
      className="w-14 h-14 mx-auto bg-gradient-to-l from-blue-800 to-blue-500 text-center rounded-full transition-transform hover:-translate-y-1"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={icon}
        fontSize="20px"
        color="white"
        className="absolute -translate-x-1/2 -translate-y-1/2"
      />
    </button>
  );
};

export default CircleButton;
