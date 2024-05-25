import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import foodContext from "../../context/foodContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotal, token, food_list, cartCount, url } =
    useContext(foodContext);
  const navigate = useNavigate();
  const [data, setdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    }
    if (getTotal() === 0) {
      navigate("/cart");
    }
  }, [token]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const orderItems = [];
    food_list.map((item, index) => {
      if (cartCount[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartCount[item._id];
        orderItems.push(itemInfo);
      }
    });
    console.log(orderItems);
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotal() + 2,
    };

    const response = await axios.post(`${url}/api/order/place`, orderData, {
      headers: { token: token },
    });
    console.log(response.data);
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("error");
    }
  };

  return (
    <div className="place-order">
      <form onSubmit={handleSubmit} className="place-order-form">
        <div className="delivery-info">
          <h2>Delivery Information</h2>
          <div className="delivery-info-name">
            <input
              onChange={handleChange}
              className="input input-half"
              type="text"
              placeholder="First name"
              required
              name="firstName"
              value={data.firstName}
            />
            <input
              onChange={handleChange}
              name="lastName"
              value={data.lastName}
              className="input input-half"
              type="text"
              placeholder="Last name"
              required
            />
          </div>
          <input
            onChange={handleChange}
            className="input"
            type="email"
            name="email"
            value={data.email}
            placeholder="Email address"
            required
          />
          <input
            onChange={handleChange}
            className="input"
            type="text"
            name="street"
            value={data.street}
            placeholder="Street"
            required
          />
          <div className="delivery-info-address">
            <div className="address-non-deep">
              <input
                onChange={handleChange}
                className="input input-half"
                type="text"
                name="city"
                value={data.city}
                placeholder="City"
                required
              />
              <input
                onChange={handleChange}
                className="input input-half"
                type="text"
                placeholder="State"
                name="state"
                value={data.state}
                required
              />
            </div>
            <div className="address-deep">
              <input
                onChange={handleChange}
                className="input input-half"
                type="text"
                name="zipcode"
                value={data.zipcode}
                placeholder="Zip-code"
                required
              />
              <input
                onChange={handleChange}
                className="input input-half"
                type="text"
                name="country"
                value={data.country}
                placeholder="Country"
                required
              />
            </div>
          </div>
          <input
            onChange={handleChange}
            className="input"
            type="tel"
            name="phone"
            value={data.phone}
            placeholder="Phone"
            required
          />
        </div>
        <div className="place-order-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotal()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotal() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotal() === 0 ? 0 : getTotal() + 2}</b>
              </div>
            </div>
            <button type="submit" onClick={() => navigation("/order")}>
              PROCEED TO PAYMENT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
