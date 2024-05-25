import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import FoodState from "./context/foodState.jsx";
import Footer from "../src/components/Footer/Footer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <FoodState>
      <App />
      <Footer />
    </FoodState>
  </BrowserRouter>
);
