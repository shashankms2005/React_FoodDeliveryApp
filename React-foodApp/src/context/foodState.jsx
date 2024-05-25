import FoodContext from "./foodContext";
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const foodState = (props) => {
  const [cartCount, setCartCount] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);

  const url = "http://localhost:4000";

  const fetchFoodList = async () => {
    try {
      const result = await axios.get(`${url}/api/list`);
      setFoodList(result.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      if (token) {
        const response = await axios.get(`${url}/api/cart/list`, {
          headers: {
            token: token,
          },
        });
        setCartCount(response.data.cartData);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      if (token) {
        await loadCartData(token);
      }
    };
    loadData();
  }, [token]);

  const getTotal = () => {
    let tc = 0;
    for (const item in cartCount) {
      if (cartCount[item] > 0) {
        let info = food_list.find((pro) => pro._id == item);
        tc += info.price * cartCount[item];
      }
    }
    return tc;
  };

  const addToCart = async (indexId) => {
    setCartCount((prev) => {
      const newCount = prev[indexId] ? prev[indexId] + 1 : 1;
      return { ...prev, [indexId]: newCount };
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { foodID: indexId },
          {
            headers: { token: token },
          }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (indexId) => {
    setCartCount((prev) => {
      const newCount = prev[indexId] ? prev[indexId] - 1 : 0;
      return { ...prev, [indexId]: newCount };
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { foodID: indexId },
          {
            headers: { token: token },
          }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const contextValue = useMemo(
    () => ({
      food_list,
      cartCount,
      setCartCount,
      addToCart,
      removeFromCart,
      getTotal,
      url,
      token,
      setToken,
    }),
    [food_list, cartCount, token]
  );

  return (
    <FoodContext.Provider value={contextValue}>
      {props.children}
    </FoodContext.Provider>
  );
};

export default foodState;
