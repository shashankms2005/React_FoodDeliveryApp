import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";
import { url, assets } from "../../assets/assets";

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}/api/orderlist`);
      setData(response.data.data);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (event, order_id) => {
    const value = event.target.value;
    try {
      const response = await axios.post(`${url}/api/orderlist/update`, {
        value: value,
        order_id: order_id,
      });
      if (response.data.success) {
        await fetchOrders();
      } else {
        setError("Failed to update order status");
      }
    } catch (err) {
      setError("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="mid">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-orders">
      <h2>Order Page</h2>
      <div className="container">
        {data.map((order) => (
          <div key={order.order_id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="parcel icon" />
            <p>
              {order.items.map((item, ind) => (
                <span key={ind}>
                  {item.name} x {item.quantity}
                  {ind < order.items.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p>Items: {order.items.length}</p>
            <p className="price">${order.amount}</p>
            <select
              onChange={(event) => handleChange(event, order.order_id)}
              value={order.status} // Assuming order has a status field
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="address">
              <p style={{ color: "black", textTransform: "uppercase" }}>
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country}, Zipcode: {order.address.zipcode}
              </p>
              <p>{order.address.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
