import React, { useRef, useState } from "react";
import "./styles.scss";

import apps from "../../system/apps";

const Dock = ({ launchApp, openApps }) => {
  const dock = useRef();
  const [horizontal, setHorizontal] = useState(null);

  return (
    <div className="dock-container">
      <div
        ref={dock}
        className="dock"
        onMouseMove={(e) => {
          const rect = dock.current.getBoundingClientRect();
          setHorizontal(((e.clientX - 12 - rect.x) * 100) / (rect.width - 24));
        }}
        onMouseLeave={() => {
          setHorizontal(null);
        }}
      >
        {apps.map((item, index) => {
          const iconCenter =
            (100 / apps.length) * index + 100 / apps.length / 2;
          const distToMouse = Math.abs(horizontal - iconCenter);
          const iconScale = 1.5;
          const finalScale =
            iconScale -
            (distToMouse / ((100 / apps.length) * 1.5)) * (iconScale - 1);
          const size = horizontal && finalScale > 1 ? 72 * finalScale : 72;

          return (
            <div
              className="icon-holder"
              key={index}
              style={{
                width: `${size}px`,
                height: `72px`
              }}
            >
              <div
                className={"icon"}
                style={{
                  backgroundImage: `url("${item.icon}")`,
                  width: `${size}px`,
                  height: `${size}px`
                }}
                onClick={() => launchApp(item.name)}
              >
                {openApps.includes(item.name) && <div className="open"></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
