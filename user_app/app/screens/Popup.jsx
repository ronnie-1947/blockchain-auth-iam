import React from "react";
import "./Popup.scss"; // Create a CSS file for styling

const PopupContent = ({
  header,
  subHeader,
  paragraph,
  onButtonClick1,
  onButtonClick2,
}) => {
  return (
    <div className="popup-content">
      <div className="popup-box">
        <div className="header-box">
          <h2>{header}</h2>
          <h3>{subHeader}</h3>
        </div>
        <p>{paragraph}</p>
      </div>
      <div className="button-container">
        <button onClick={() => onButtonClick1()}>Accept</button>
        <button onClick={() => onButtonClick2()}>Revoke</button>
      </div>
    </div>
  );
};

export default PopupContent;
