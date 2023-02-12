import React, { useState, useRef } from "react";
import "./styles.scss";

import Dock from "../../components/Dock";
import Window from "../../components/Window";
import ContextBar from "../../components/ContextBar";

import apps from "../../system/apps";
import config from "../../system/config";
import MaxIndicator from "../../components/MaxIndicator";

const Desktop = () => {
  const desktopArea = useRef();
  const background = ["https://i.imgur.com/gzb1LiW.jpeg"];
  const [selectedBg, setSelectedBg] = useState(0);
  const [activeWindow, setActiveWindow] = useState(null);
  const [windowInfo, setWindowInfo] = useState({});
  const [movingWindow, setMovingWindow] = useState(null);
  const [maxIndicator, setMaxIndicator] = useState(false);

  const launchApp = (name) => {
    const newWindowInfo = { ...windowInfo };
    if (newWindowInfo[name]) {
      minimizeWindow(name);
      if (newWindowInfo[name].show) {
        setActiveWindow(name);
      }
    } else {
      const app = apps.find((app) => app.name === name);
      const w = app.w || config.DEFAULT_APP_WIDTH;
      const h = app.h || config.DEFAULT_APP_HEIGHT;
      newWindowInfo[name] = newWindowInfo[name] || {
        name: name,
        pos: {
          x: window.innerWidth / 2 - w / 2,
          y: desktopArea.current.getBoundingClientRect().height / 2 - h / 2,
          z: Math.round(Date.now() / 1000),
          w: w,
          h: h
        },
        initPos: { ox: 0, oy: 0, x: 0, y: 0 },
        show: true,
        max: false
      };
      setWindowInfo(newWindowInfo);
      setActiveWindow(name);
    }
  };

  const setInitPos = (name, e) => {
    const newWindowInfo = { ...windowInfo };
    newWindowInfo[name].pos = {
      ...newWindowInfo[name].pos,
      z: Math.round(Date.now() / 1000)
    };
    newWindowInfo[name].initPos = {
      ...newWindowInfo[name].initPos,
      ox: newWindowInfo[name].pos.x,
      oy: newWindowInfo[name].pos.y,
      x: e.clientX,
      y: e.clientY
    };
    setWindowInfo(newWindowInfo);
    setMovingWindow(name);
    setActiveWindow(name);
  };

  const moveWindow = (name, e) => {
    const newWindowInfo = { ...windowInfo };
    newWindowInfo[name].pos = {
      ...newWindowInfo[name].pos,
      x:
        newWindowInfo[name].initPos.ox +
        (e.clientX - newWindowInfo[name].initPos.x),
      y:
        newWindowInfo[name].initPos.oy +
        (e.clientY - newWindowInfo[name].initPos.y)
    };
    newWindowInfo[name].pos = {
      ...newWindowInfo[name].pos,
      y: newWindowInfo[name].pos.y < 0 ? 0 : newWindowInfo[name].pos.y
    };
    newWindowInfo[name].max = false;
    setWindowInfo(newWindowInfo);
    setMaxIndicator(newWindowInfo[name].pos.y === 0);
  };

  const minimizeWindow = (name) => {
    const newWindowInfo = { ...windowInfo };
    newWindowInfo[name].show = !newWindowInfo[name].show;
    if (newWindowInfo[name].show) {
      newWindowInfo[name].pos = {
        ...newWindowInfo[name].pos,
        z: Math.round(Date.now() / 1000)
      };
    }
    setWindowInfo(newWindowInfo);
    setActiveWindow(newWindowInfo[name].show ? name : null);
  };

  const maximizeWindow = (name) => {
    const newWindowInfo = { ...windowInfo };
    newWindowInfo[name] = {
      ...newWindowInfo[name],
      max: !newWindowInfo[name].max
    };
    setWindowInfo(newWindowInfo);
  };

  const closeWindow = (name) => {
    const newWindowInfo = { ...windowInfo };
    delete newWindowInfo[name];
    setWindowInfo(newWindowInfo);
    setActiveWindow(null);
  };

  return (
    <div
      className="desktop"
      style={{ backgroundImage: `url("${background[selectedBg]}")` }}
      onClick={(e) => {
        if (e.target.className === "desktop-area") {
          setActiveWindow(null);
        }
      }}
      onMouseUp={() => {
        if (movingWindow && windowInfo[movingWindow].pos.y === 0) {
          maximizeWindow(movingWindow);
        }
        setMaxIndicator(false);
        setMovingWindow(null);
      }}
      onMouseMove={(e) => {
        if (movingWindow) {
          moveWindow(movingWindow, e);
        }
      }}
    >
      <ContextBar activeWindow={activeWindow} />
      <div ref={desktopArea} className="desktop-area">
        {maxIndicator && <MaxIndicator />}
        {Object.keys(windowInfo).map((item) => (
          <Window
            key={item}
            {...windowInfo[item]}
            appInfo={apps.find((app) => app.name === item)}
            setInitPos={setInitPos}
            minimizeWindow={minimizeWindow}
            maximizeWindow={maximizeWindow}
            closeWindow={closeWindow}
            moving={movingWindow === item}
            active={activeWindow === item}
          />
        ))}
      </div>
      <Dock launchApp={launchApp} openApps={Object.keys(windowInfo)} />
    </div>
  );
};

export default Desktop;
