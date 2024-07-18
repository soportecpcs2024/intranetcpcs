import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import Logo from "/logo.png"; // Ajusta la ruta según la ubicación real de logo.png en tu proyecto

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleRegisterSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="auth">
      <div className="header-login">
        <h1>CPCS</h1>
        <h3><span>Celebrating 30 years</span>of shaping leaders in Christ for Colombia and the nations</h3>
       
      </div>
      <div className="form-base">
        <div className="divlogo">
          <img className="logo-auth" src={Logo} alt="Logo CPCS" />
        </div>
        <div className="formulario">
          <div className="divbtn">
            <div className="auth__tabs">
              <button
                className={activeTab === "login" ? "active" : ""}
                onClick={() => handleTabChange("login")}
              >
                Login Up
              </button>
              <button
                className={activeTab === "register" ? "active" : ""}
                onClick={() => handleTabChange("register")}
              >
                Register
              </button>
            </div>
            <div className="auth__forms">
              {activeTab === "login" && <LoginForm />}
              {activeTab === "register" && (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
