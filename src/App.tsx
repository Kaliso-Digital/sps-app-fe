// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Layout from "./Layout";
import "./index.css";
import PasswordReset from "./Pages/passwordReset";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import { PermissionsProvider } from "./Service/PermissionsContext";
import SignUpStepOne from "./Pages/SignUpStepOne";

const App = () => {
  return (
    <Router>
      <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure
      >
        <PermissionsProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/signup" element={<SignUpStepOne />} /> */}
            <Route
              path="/*"
              element={
                <RequireAuth loginPath="/">
                  <Layout />
                </RequireAuth>
              }
            />
            <Route path="/resetpassword" element={<PasswordReset />} />
            <Route
              path="/resetpassword/:email/:token"
              element={<PasswordReset />}
            />
          </Routes>
        </PermissionsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
