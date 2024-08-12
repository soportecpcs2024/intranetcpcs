import React from "react";
import { useAuth } from "../../../contexts/AuthContext";

const HeaderInventory = () => {
  const { user } = useAuth();

  return (
    <div className="header">
      <div className="--flex--between">
        <h3>
          <span className="--fw-thin">Bienvenido, </span>
          <span className="--color--danger">{user ? user.name : 'Guest'}</span>
        </h3>
      </div>
    </div>
  );
};

export default HeaderInventory;
