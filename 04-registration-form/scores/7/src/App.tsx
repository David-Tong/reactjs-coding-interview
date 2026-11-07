import { User } from "./types";
import { register } from "./apis";
import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(false);

  const process = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setRepasswordError("");
    setDisable(true);
    setMessage("Submitting ...");

    let hasError = false;
    if (name.trim() === "") {
      setNameError("Name can't be empty");
      hasError = true;
    }

    if (email.trim() === "") {
      setEmailError("Email can't be empty");
      hasError = true;
    }

    // validate email format
    if (!validate(email)) {
      setEmailError("Email must be valid");
      hasError = true;
    }

    if (password.trim() === "") {
      setPasswordError("Password can't be empty");
      hasError = true;
    }

    if (repassword.trim() === "") {
      setRepasswordError("Password again can't be empty");
      hasError = true;
    }

    if (password !== repassword) {
      setRepasswordError("Password input twice must be equal");
      hasError = true;
    }

    if (hasError) {
      setMessage("");
      setDisable(false);
      return;
    }

    // call register
    const user: User = {
      name: name.trim(),
      email: email.trim(),
      password: password,
    };
    register(user)
      .then((response) => {
        setMessage(response.message);
        setDisable(false);
      })
      .catch((response) => {
        setMessage(response.message);
        setDisable(false);
      });
  };

  const validate = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._+]+@[a-zA-Z-0-9._]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          process();
        }}
      >
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          {nameError}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          {emailError}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          {passwordError}
        </div>
        <div>
          <label>Password Again</label>
          <input
            type="password"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          ></input>
          {repasswordError}
        </div>
        <p>{message}</p>
        <button type="submit" disabled={disable}>
          Register
        </button>
      </form>
    </>
  );
}
