import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const navigate = useNavigate();
  const { name, token } = useAuth();

  useEffect(() => {
    if (!name || !token) {
      navigate("/auth");
    }
  }, [name, token, navigate]);

  if (!name || !token) return null;

  return (
    <div className="main-container">
      <Sidebar Outlet={Outlet} />
    </div>
  );
};

export default MainLayout;
