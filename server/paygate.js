//payment gateway server using razorpay
const express = require("express");
const Razorpay = require("razorpay");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY, 
    });

    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, 
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error creating order");
    }

    res.json(order);
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).send("Error creating payment order");
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
