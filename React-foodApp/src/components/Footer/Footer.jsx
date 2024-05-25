import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="contact-us">
      <div className="footer-content">
        <div className="footer-left">
          <img src={assets.logo} />
          <p>
            Tomato is dedicated to bringing you the freshest, tastiest meals
            directly to your door. Explore our diverse menu, seasonal specials,
            and local favorites.
          </p>
          <div className="footer-left-logo">
            <img src={assets.facebook_icon} />
            <img src={assets.twitter_icon} />
            <img src={assets.linkedin_icon} />
          </div>
        </div>
        <div className="footer-center">
          <p>COMPANY</p>
          <ul className="footer-center-li">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-right">
          <p>GET IN TOUCH</p>
          <ul className="footer-right-li">
            <li>+91-7483288142</li>
            <li>contact@mail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p id="fp">Copyrights @Shashank M S</p>
    </div>
  );
};

export default Footer;
