import React, { useEffect, useState } from "react";
import { url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./List.css";

const List = () => {
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getItems = async () => {
    try {
      const response = await axios.get(`${url}/api/list`);
      setListItems(response.data);
    } catch (err) {
      setError("Error fetching items");
      toast.error("Error fetching items");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleListClickDel = async (id) => {
    console.log("id=", id);
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Item removed successfully");
        setListItems((prevItems) =>
          prevItems.filter((item) => item._id !== id)
        );
      } else {
        toast.error("Failed to remove item");
      }
    } catch {
      toast.error("Failed to remove item");
    }finally{
      getItems();
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  if (loading) {
    return <div className="mid">Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="list-table">
      <h2 style={{textAlign:"center",paddingBottom:"5px"}}>All Food List</h2>
      <div className="list-table-format title">
        <b>Image</b>
        <b>Name</b>
        <b>Category</b>
        <b>Price</b>
        <b>Action</b>
      </div>
      {console.log("List items(stateVariable):", listItems)}
      {listItems.map((item, index) => (
        <div key={index} className="list-table-format">
          <img src={`${url}/${item.image}`} alt={item.name} />
          <p>{item.name}</p>
          <p>{item.category}</p>
          <p>{item.price}</p>
          <p className="cursor" onClick={() => handleListClickDel(item._id)}>
            X
          </p>
        </div>
      ))}
    </div>
  );
};

export default List;
