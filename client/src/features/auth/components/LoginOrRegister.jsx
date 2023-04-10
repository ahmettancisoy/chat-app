import React from "react";
import { Link } from "react-router-dom";

const LoginOrRegister = (props) => {
  const { name } = props;

  if (name === "login") {
    return (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 max-w-max w-full font-normal text-sm text-gray-900">
        Not a member yet? Click{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          here
        </Link>{" "}
        to register.
      </div>
    );
  } else if (name === "register") {
    return (
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 max-w-max w-full font-normal text-sm text-gray-900">
        Already a member? Click{" "}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          here
        </Link>{" "}
        to login.
      </div>
    );
  }
};

export default LoginOrRegister;
