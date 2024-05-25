import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Add from "../src/pages/Add/Add.jsx";
import List from "../src/pages/List/List.jsx";
import Order from "../src/pages/Orders/Orders.jsx";
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
       <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
      <Sidebar />
      <Routes>
        <Route path="/add" element={<Add />} />
        <Route path="/list" element={<List />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
      </div>
    </div>
  );
};

export default App;
