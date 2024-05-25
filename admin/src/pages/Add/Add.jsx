import React, { useState } from "react";
import "./Add.css";
import { url } from "../../assets/assets";
import { assets } from "../../assets/assets";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [img, setImage] = useState(null);
  const [items, setItems] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  function handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    setItems((prev) => ({ ...prev, [name]: value }));
  }

  const handelSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", items.name);
    formData.append("description", items.description);
    formData.append("price", items.price);
    formData.append("category", items.category);
    formData.append("image", img);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("Product added successfully!");
        toast.success("Item successfully added to database");
        setItems({
          name: "",
          description: "",
          price: "",
          category: "Salad",
        });
        setImage(null);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add item to database");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={handelSubmit}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={img ? URL.createObjectURL(img) : assets.upload_area} />
          </label>
          {/* handling onChange for input file and to render in frontend we need to create URL for obj */}
          {/*htmlFor value should be same as corresponding input id*/}
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            required
            hidden
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={handleChange}
            value={items.name}
            type="text"
            name="name"
            placeholder="Enter here"
            required
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={handleChange}
            value={items.description}
            name="description"
            rows={6}
            placeholder="Enter content here"
          />
        </div>
        <div className="add-pc">
          <div className="  add-product-category flex-col">
            <p>Product category</p>
            <select
              onChange={handleChange}
              value={items.category}
              name="category"
            >
              <option value="Salad">Salad</option>
              <option value="Rools">Rools</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="  add-product-price flex-col">
            <p>Product price</p>
            <input
              onChange={handleChange}
              value={items.price}
              type="number"
              name="price"
              placeholder="$0"
              required
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
