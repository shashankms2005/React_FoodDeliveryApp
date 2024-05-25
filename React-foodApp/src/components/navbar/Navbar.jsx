import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import foodContext from "../../context/foodContext";

const Navbar = ({ setSignPop }) => {
  const [menu, setMenu] = useState("home");
  const { getTotal, token, setToken, setCartCount } = useContext(foodContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
    setCartCount({});
  };
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={assets.logo} />
        </Link>
      </div>
      <ul className="navbar-middle">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          home
        </Link>
        <a
          href="#menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          menu
        </a>
        <a
          href="#mobile-app"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>
        <a
          href="#contact-us"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact-us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} />
        <div className="bag-dot">
          <div className={getTotal() === 0 ? null : "dot"}></div>
          <Link to="/cart">
            <img src={assets.basket_icon} />
          </Link>
        </div>
        {token === "" ? (
          <button className="navbar-signin" onClick={() => setSignPop(true)}>
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} />
                <p onClick={()=>navigate('/myorders')}>Orders</p>
              </li>
              <li>
                <img src={assets.logout_icon} />
                <p onClick={logout}>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
