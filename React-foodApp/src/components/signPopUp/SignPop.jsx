import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import "./SignPop.css";
import axios from "axios";
import foodContext from "../../context/foodContext";

const SignPop = ({ setSignPop }) => {
  const [currState, SetCurrState] = useState("Login");
  const { url, token, setToken } = useContext(foodContext);
  const [data, setData] = useState({
    name: "",
    password: "",
    gmail: "",
  });

  const handleOnchange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const handelOnSubmit = async (event) => {
    event.preventDefault();
    let currUrl = url;
    if (currState === "Login") {
      currUrl = currUrl + "/api/user/login";
    } else if (currState === "Sign up") {
      currUrl = currUrl + "/api/user/register";
    }
    console.log(currUrl);
    const result = await axios.post(currUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.data.success) {
      alert(result.data.message);
    }
    if (result.data.success) {
      setToken(result.data.token);
      localStorage.setItem("token", result.data.token);
      setSignPop(false);
    }
  };
  return (
    <div className="login-popup">
      <form onSubmit={handelOnSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img src={assets.cross_icon} onClick={() => setSignPop(false)} />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input
              name="name"
              value={data.name}
              onChange={handleOnchange}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="gmail"
            value={data.gmail}
            onChange={handleOnchange}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            value={data.password}
            onChange={handleOnchange}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Login" ? "Login" : "Create new account"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => SetCurrState("Sign up")}>Click here..</span>
          </p>
        ) : (
          <p>
            Already have a account?{" "}
            <span onClick={() => SetCurrState("Login")}>Click here..</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default SignPop;
