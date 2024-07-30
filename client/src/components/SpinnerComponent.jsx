// SpinnerComponent.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners';

const SpinnerComponent = () => (
  <div className="spinner-container">
    <ClipLoader size={50} color={"#123abc"} loading={true} />
  </div>
);

export default SpinnerComponent;
