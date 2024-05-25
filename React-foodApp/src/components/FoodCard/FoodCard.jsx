import React, { useContext } from "react";
import "./FoodCard.css";
import { assets } from "../../assets//assets";
import foodContext from "../../context/foodContext";

export const FoodCard = ({ index, img, name, star, des, price }) => {
  const { cartCount, setCartCount, addToCart, removeFromCart } =
    useContext(foodContext);
  return (
    <div className="display-item">
      {}
      <img className="food-img" src={img} />
      {!cartCount[index] ? (
        <img
          className="food-add"
          src={assets.add_icon_white}
          onClick={() => addToCart(index)}
        />
      ) : (
        <div className="add-del">
          <img
            className="add"
            src={assets.add_icon_green}
            onClick={() => addToCart(index)}
          />
          <p>{cartCount[index]}</p>
          <img
            className="del"
            src={assets.remove_icon_red}
            onClick={() => removeFromCart(index)}
          />
        </div>
      )}

      <div className="content">
        <div className="name-star">
          <p>{name}</p>
          <img src={star} />
        </div>
        <p className="food-item-des">{des}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};
