import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@chakra-ui/react";
import { useNotification } from "../../utils/useNotification";

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const notification = useNotification();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [loading, setLoading] = useState(false);
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
      notification.error(
        "Please fix the following errors:\n\n",
        errors.join("\n\n")
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUpActive) {
      if (validateUserDetails(userDetails)) {
        setLoading(true);
        await axios
          .post("/api/users/register", userDetails)
          .then(() => {
            notification.success("Success !", "User Successfully Registered !");
            setLoading(false);
            setUserDetails({
              name: "",
              mobile: "",
              email: "",
              sic: "",
              password: "",
            });
            setIsSignUpActive(false);
          })
          .catch((err) => {
            setLoading(false);
            notification.error("Error !", err.message);
          });
      }
    } else {
      if (
        loginDetails.password.length === 0 ||
        loginDetails.email.length === 0
      ) {
        notification.error("Error !", "Please fill valid email and password !");
      } else {
        setLoading(true);
        await axios
          .post("/api/users/login", loginDetails)
          .then((res) => {
            login(res.data);
            notification.success("Login Successfull !", "");
            setLoading(false);
            setLoginDetails({ email: "", password: "" });
            navigate("/");
          })
          .catch(() => {
            setLoading(false);
            notification.error("Something went wrong !", "Invalid Credentials");
          });
      }
    }
  };

  return (
    <div id="auth" style={{ background: "#ffd762" }}>
      <Text color="tomato" style={{ fontSize: "40px", fontWeight: "bold" }}>
        MusiQ 360
      </Text>
      <div
        className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
      >
        <div className="form-container sign-up-container">
          <form action="#" onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              type="number"
              placeholder="Mobile Number"
              value={userDetails.mobile}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, mobile: e.target.value }))
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="SIC"
              value={userDetails.sic}
              onChange={(e) =>
                setUserDetails((prev) => ({ ...prev, sic: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={userDetails.password}
              onChange={(e) =>
                setUserDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <Button isLoading={loading} variant="solid" type="submit">
              Sign up
            </Button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#" onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <input
              type="email"
              placeholder="Email"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            <Button isLoading={loading} variant="solid" type="submit">
              Login
            </Button>
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
