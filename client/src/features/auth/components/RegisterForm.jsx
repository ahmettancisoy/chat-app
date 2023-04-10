import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputEmail from "./InputEmail";
import InputPassword from "./InputPassword";
import SubmitButton from "./SubmitButton";
import useAuth from "../../../hook/useAuth";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords must match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirmPassword }),
        }
      );

      const data = await response.json();
      if (response.status !== 201) {
        console.log(data.message);
        setError(data.message);
        setIsLoading(false);
        return;
      }
      setAuth(data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputPassword
        name="password"
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputPassword
        name="confirmPassword"
        id="confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="mt-2">
        <SubmitButton text="Register" isLoading={isLoading} />
      </div>
    </form>
  );
};

export default RegisterForm;
