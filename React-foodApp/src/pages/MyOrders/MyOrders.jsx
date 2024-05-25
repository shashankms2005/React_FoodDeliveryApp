import React, { useContext, useEffect, useState } from "react";
import foodContext from "../../context/foodContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./MyOrders.css";

const MyOrders = () => {
  const { url, token } = useContext(foodContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      if (token) {
        const response = await axios.get(`${url}/api/order/userorders`, {
          headers: { token: token },
        });
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleClick = async (order_id) => {
    if (token) {
      try {
        console.log(order_id);
        const response = await axios.get(
          `${url}/api/orderlist/status`,
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
            params: {
              order_id: order_id,
            },
          }
        );
  
        const newStatus = response.data.delivery_status;
  
        setData((prev) =>
          prev.map((order) =>
            order.order_id === order_id
              ? { ...order, status: newStatus }
              : order
          )
        );
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    }
  };
  

  useEffect(() => {
    fetchOrders();
  }, [url, token]);



  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} />
            <p>
              {order.items.map((item, ind) => {
                return ind === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `;
              })}
            </p>
            <p>${order.amount}</p>
            <p>items:{order.items.length}</p>
            <p>
              &#x25cf;<span>{order.status}</span>
            </p>
            <button onClick={() => handleClick(order.order_id)}>
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
