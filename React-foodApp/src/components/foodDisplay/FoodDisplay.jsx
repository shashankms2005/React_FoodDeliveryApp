import React, { useContext } from "react";
import "./FoodDisplay.css";
import foodContext from "../../context/foodContext";
import { assets } from "../../assets/assets";
import { FoodCard } from "../FoodCard/FoodCard";

const FoodDisplay = ({ category }) => {
  const { food_list, url } = useContext(foodContext);

  return (
    <div className="food-display">
      <p>Top dishes near you</p>
      <div className="food-display-card">
        {food_list.map((item, index) =>
          category === "All" || category === item.category ? (
            <FoodCard
              key={index}
              index={item._id}
              img={`${url}/${item.image}`}
              name={item.name}
              star={assets.rating_starts}
              des={item.description}
              price={item.price}
            />
          ) : (
            " "
          )
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
