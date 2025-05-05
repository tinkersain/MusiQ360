import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    mobile: "",
    email: "",
    sic: "",
    password: "",
  });

  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  const validateUserDetails = (details) => {
    const errors = [];

    // Check for empty fields
    Object.entries(details).forEach(([key, value]) => {
      if (!value.trim()) {
        errors.push(
          `${key.charAt(0).toUpperCase() + key.slice(1)} is required`
        );
      }
    });

    // Validate mobile (only if filled)
    if (details.mobile && !/^\d{10}$/.test(details.mobile)) {
      errors.push("Mobile number must be exactly 10 digits");
    }

    // Validate email (only if filled)
    if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      errors.push("Email is not valid");
    }

    // Show alert if errors exist
    if (errors.length > 0) {
      alert("Please fix the following errors:\n\n" + errors.join("\n"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUpActive) {
      if (validateUserDetails(userDetails)) {
        console.log(userDetails);
        await axios
          .post("/api/users/register", userDetails)
          .then(() => {
            alert("User Successfully Registered !");
            setIsSignUpActive(false);
          })
          .catch((err) => console.log(err));
      }
    } else {
      if (
        loginDetails.password.length === 0 ||
        loginDetails.email.length === 0
      ) {
        alert("Please fill valid email and password !");
      } else {
        await axios
          .post("/api/users/login", loginDetails)
          .then((res) => {
            login(res.data);
            navigate("/");
          })
          .catch((err) => alert(err.response.data.message));
      }
    }
  };

  return (
    <div id="auth">
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        <div className="form-container sign-up-container">
          <form action="#" onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="number"
              placeholder="Mobile Number"
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, mobile: e.target.value }))
              }
            />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="SIC"
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, sic: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#" onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) =>
                setLoginDetails((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setLoginDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost"
                onClick={() => setIsSignUpActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={() => setIsSignUpActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
