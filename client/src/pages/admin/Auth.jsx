import React, { useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import Logo from "/logo2025.png";
  // Ajusta la ruta según la ubicación real de logo.png en tu proyecto

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
      
      <div className="form-base">
        <div className="divlogo">
          <img className="logo-auth" src={Logo} alt="Logo CPCS" />
        </div>
        <div className="formulario">
          <div className="divbtn">
         
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
