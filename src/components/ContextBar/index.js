import React from "react";
import "./styles.scss";

const ContextBar = ({ activeWindow }) => {
  return (
    <div className="context-bar">
      <div
        className="logo"
        style={{ backgroundImage: 'url("https://i.imgur.com/bjKA3u6.png")' }}
      ></div>
      <label>{activeWindow || "Desktop"}</label>
    </div>
  );
};

export default ContextBar;
