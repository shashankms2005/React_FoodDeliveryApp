import React, { useContext, useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Cart from "./pages/cart/Cart";
import PlaceOrder from "./pages/placeOrder/PlaceOrder";
import { Route, Routes } from "react-router-dom";
import SignPop from "./components/signPopUp/SignPop";
import Verify from "./pages/Verify/Verify"
import MyOrders from "./pages/MyOrders/MyOrders.jsx";

const App = () => {
  const [signPop, setSignPop] = useState(false);
  return (
    <>
      {signPop ? <SignPop setSignPop={setSignPop} /> : null}
      <div className="app">
        <Navbar setSignPop={setSignPop} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
