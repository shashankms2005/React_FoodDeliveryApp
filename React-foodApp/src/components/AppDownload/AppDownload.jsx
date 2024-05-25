import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
const AppDownload = () => {
  return (
    <div className="app-download" id="mobile-app">
      <p>For better experience download</p>
      <p>Tomato app</p>
      <div className="img-app">
        <img src={assets.app_store} />
        <img src={assets.play_store} />
      </div>
    </div>
  );
};

export default AppDownload;
