import React from "react";
import "./styles.scss";

const Window = ({
  appInfo,
  pos,
  setInitPos,
  show,
  max,
  moving,
  active,
  minimizeWindow,
  maximizeWindow,
  closeWindow
}) => {
  return (
    <div
      className={`window ${show ? "open" : "minimized"} ${
        moving ? "moving" : ""
      } ${active ? "active" : ""}`}
      style={{
        left: max ? 0 : pos.x,
        top: max ? 0 : pos.y,
        zIndex: pos.z,
        width: max ? "100%" : `${pos.w}px`,
        height: max ? "100%" : `${pos.h}px`
      }}
    >
      <div className="window-border"></div>
      <div
        className="window-handler"
        onMouseDown={(e) => setInitPos(appInfo.name, e, false)}
        onMouseUp={(e) => setInitPos(appInfo.name, e, true)}
      >
        {appInfo.name}
        <div className="window-buttons">
          <div
            className="icon"
            style={{ backgroundImage: `url("${appInfo.icon}")` }}
          ></div>
          <div
            className="min"
            onClick={() => minimizeWindow(appInfo.name)}
          ></div>
          <div
            className="max"
            onClick={() => maximizeWindow(appInfo.name)}
          ></div>
          <div
            className="close"
            onClick={() => closeWindow(appInfo.name)}
          ></div>
        </div>
      </div>
      <div className="window-content"></div>
    </div>
  );
};

export default Window;
