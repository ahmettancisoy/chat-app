import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../hook/useAuth";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import SubmitButton from "./SubmitButton";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      setEmail("");
      setPassword("");
      if (response.status !== 200) {
        setError(data.message);
        setIsLoading(false);
        return;
      }
      setAuth(data);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit}>
      <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputPassword
        name="password"
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="form-checkbox h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-0 focus:ring-offset-0"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
      <SubmitButton text={"Login"} isLoading={isLoading} />
    </form>
  );
};

export default SignInForm;
