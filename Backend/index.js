import express from "express";
import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

const saltRound = 10;
const app = express();
const port = 4000;
const frontend_url = "http://localhost:5173";
const stripe = Stripe(process.env.stripe_key);

app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

const { Pool } = pkg;

const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_key);
};

const getUserID = (token) => {
  const token_decode = jwt.verify(token, process.env.JWT_key);
  return token_decode.id;
};

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File name will be unique to avoid overwriting
  },
});

const upload = multer({ storage: storage });

app.post("/api/food/add", upload.single("image"), async (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file.filename; // Retrieve the filename of the uploaded file

  try {
    await db.query(
      "INSERT INTO food_items(name, description, price, category, image) VALUES($1, $2, $3, $4, $5);",
      [name, description, price, category, image]
    );
    res.send("Values inserted into table");
  } catch (error) {
    console.error("Error inserting values into table:", error);
    res.status(500).send("Error inserting values into table");
  }
});

app.get("/api/list", async (req, res) => {
  const result = await db.query("SELECT * FROM food_items");
  res.json(result.rows);
});

app.post("/api/food/remove", async (req, res) => {
  const id = req.body.id;
  try {
    const result = await db.query(
      "SELECT image FROM food_items WHERE _id = $1",
      [id]
    );
    const imageFileName = result.rows[0].image;

    // Delete the image file from the uploads directory
    fs.unlinkSync(`uploads/${imageFileName}`);

    await db.query("DELETE FROM food_items WHERE _id = $1", [id]);

    res.send("Food item removed successfully");
  } catch (error) {
    console.error("Error removing food item:", error);
    res.status(500).send("Error removing food item");
  }
});

app.post("/api/user/register", async (req, res) => {
  const { name, password, gmail } = req.body;
  try {
    const response = await db.query(
      "select * from login_register where gmail=$1",
      [gmail]
    );
    if (response.rowCount != 0) {
      return res.json({
        success: false,
        message: `User with ${gmail} already registered !`,
      });
    }
    if (!validator.isEmail(gmail)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter valid password",
      });
    }

    const hash = await bcrypt.hash(password, saltRound);

    await db.query(
      "INSERT INTO login_register (name, password, gmail) VALUES($1,$2,$3)",
      [name, hash, gmail]
    );
    const result2 = await db.query(
      "select * from login_register where gmail=$1",
      [gmail]
    );
    const token = createToken(result2.rows[0]._id);
    return res.json({
      success: true,
      token,
      message: "user successfully registered",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
});

app.post("/api/user/login", async (req, res) => {
  const { password, gmail } = req.body;
  try {
    const response = await db.query(
      "select * from login_register where gmail=$1",
      [gmail]
    );
    if (response.rowCount == 0) {
      return res.json({
        success: false,
        message: `User Doesn't exist !`,
      });
    }

    const result = await bcrypt.compare(password, response.rows[0].password);
    if (result) {
      const token = createToken(response.rows[0]._id);
      return res.json({
        success: true,
        token,
        message: "user successfully logged-in",
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error });
  }
});

app.post("/api/cart/add", async (req, res) => {
  const { token } = req.headers;
  const food_id = req.body.foodID;
  const user_id = getUserID(token);
  try {
    const user_result = await db.query(
      "SELECT cartdata from login_register where _id=$1",
      [user_id]
    );
    const cartData = user_result.rows[0].cartdata;
    if (!cartData[food_id]) {
      cartData[food_id] = 1;
    } else {
      cartData[food_id] += 1;
    }

    await db.query("UPDATE login_register SET cartdata=$1 where _id=$2", [
      cartData,
      user_id,
    ]);
    res.json({
      message: "Item successfully added to cart",
      success: true,
      cartData,
    });
  } catch {
    res.json({ message: "Error", success: false });
  }
});

app.post("/api/cart/remove", async (req, res) => {
  const { token } = req.headers;
  const food_id = req.body.foodID;
  const user_id = getUserID(token);
  try {
    const user_result = await db.query(
      "SELECT cartdata from login_register where _id=$1",
      [user_id]
    );
    const cartData = user_result.rows[0].cartdata;
    if (cartData[food_id] > 0) {
      cartData[food_id] -= 1;
    }
    await db.query("UPDATE login_register SET cartdata=$1 where _id=$2", [
      cartData,
      user_id,
    ]);
    res.json({
      message: "Item successfully removed from cart",
      success: true,
      cartData,
    });
  } catch {
    res.json({ message: "Error", success: false });
  }
});

app.get("/api/cart/list", async (req, res) => {
  const { token } = req.headers;
  const user_id = getUserID(token);
  try {
    const user_result = await db.query(
      "SELECT cartdata from login_register where _id=$1",
      [user_id]
    );
    const cartData = user_result.rows[0].cartdata;
    res.json({
      success: true,
      cartData,
    });
  } catch {
    res.json({ message: "Error", success: false });
  }
});

app.post("/api/order/place", async (req, res) => {
  try {
    const { token } = req.headers;
    const { items, amount, address } = req.body;
    const userId = getUserID(token);

    const itemsJson = JSON.stringify(items);
    const addressJson = JSON.stringify(address);

    await db.query(
      "INSERT INTO orders_list (user_id, items, amount, address, status, date, payment) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        userId,
        itemsJson,
        amount,
        addressJson,
        "Food Processing",
        new Date(),
        false,
      ]
    );

    await db.query("UPDATE login_register SET cartdata=$1 WHERE _id=$2", [
      {},
      userId,
    ]);

    //Stripe integration
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const response = await db.query(
      "SELECT order_id FROM orders_list WHERE user_id=$1 AND amount=$2 ORDER BY date DESC LIMIT 1",
      [userId, amount]
    );

    const orderId = response.rows[0].order_id;

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderID=${orderId}`,
      cancel_url: `${frontend_url}/verify?success=false&orderID=${orderId}`,
    });
    //first stripe payment pageUrl next verifyUrl
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.json({ success: false, message: "Error" });
  }
});

app.post("/api/order/verify", async (req, res) => {
  try {
    const { orderID, success } = req.body;
    if (success) {
      await db.query("UPDATE orders_list SET payment=$1 WHERE order_id=$2", [
        true,
        orderID,
      ]);
      res.json({ success: true, message: "Paid" });
    } else {
      await db.query("Delete from orders_list where order_id=$1", orderID);
      res.json({ success: false, message: "Error" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

app.get("/api/order/userorders", async (req, res) => {
  try {
    const { token } = req.headers;
    const userId = getUserID(token);
    const response = await db.query(
      "select * from orders_list where user_id=$1",
      [userId]
    );
    res.json(response.rows);
  } catch {
    res.json("Error");
  }
});

app.get("/api/orderlist", async (req, res) => {
  try {
    const response = await db.query("select * from orders_list");
    res.json({ success: true, data: response.rows });
  } catch {
    res.json({ success: false });
  }
});

app.post("/api/orderlist/update", async (req, res) => {
  const { value, order_id } = req.body;
  try {
    await db.query("update orders_list set status=$1 where order_id=$2", [
      value,
      order_id,
    ]);
    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
});

app.get("/api/orderlist/status", async (req, res) => {
  const { order_id } = req.query;

  try {
    const response = await db.query(
      "SELECT status FROM orders_list WHERE order_id=$1",
      [order_id]
    );
    if (response.rows.length > 0) {
      res.json({ status: true, delivery_status: response.rows[0].status });
    } else {
      res.status(404).json({ status: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
