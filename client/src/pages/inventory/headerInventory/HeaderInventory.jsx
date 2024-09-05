import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import './headerInventory.css'
const HeaderInventory = () => {
  const { user } = useAuth();

  return (
    <div className="header-inventory">
      <div className="--flex--between--inventory">
        <h3>
          <span className="--fw-thin--inventory">Bienvenido, </span>
          <span className="--color--danger--inventory">{user ? user.name : 'Guest'}</span>
        </h3>
      </div>
    </div>
  );
};

export default HeaderInventory;
