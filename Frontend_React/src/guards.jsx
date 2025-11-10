import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import config from "./config";

const ensureMockAdminSession = () => {
  if (!config.USE_ADMIN_MOCKS) {
    return null;
  }

  const existingToken = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  const existingRole = localStorage.getItem(config.STORAGE_KEYS.ROLE);

  if (!existingToken) {
    localStorage.setItem(config.STORAGE_KEYS.TOKEN, "mock-admin-token");
    localStorage.setItem(config.STORAGE_KEYS.LOGGED_IN, "true");
  }

  if (existingRole !== "admin") {
    localStorage.setItem(config.STORAGE_KEYS.ROLE, "admin");
  }

  if (!localStorage.getItem(config.STORAGE_KEYS.USER)) {
    const mockAdminUser = {
      _id: "mock-admin-id",
      name: "Admin Demo",
      email: "admin@medicare.com",
      role: "admin",
    };
    localStorage.setItem(
      config.STORAGE_KEYS.USER,
      JSON.stringify(mockAdminUser)
    );
  }

  return {
    token: localStorage.getItem(config.STORAGE_KEYS.TOKEN),
    role: "admin",
  };
};

export const RequireSignedIn = ({ children }) => {
  const mockSession = ensureMockAdminSession();
  const token = mockSession?.token || localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export const RequireAdmin = ({ children }) => {
  const mockSession = ensureMockAdminSession();
  const token = mockSession?.token || localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  const role = mockSession?.role || localStorage.getItem(config.STORAGE_KEYS.ROLE);
  if (!token || role !== "admin") {
    return <Navigate to="/403" replace />;
  }
  return children;
};
