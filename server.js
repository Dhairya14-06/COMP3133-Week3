require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

app.get("/restaurants", async (req, res) => {
  try {
    const sortBy = (req.query.sortBy || "").toUpperCase();

    if (!sortBy) {
      const data = await Restaurant.find({});
      return res.json(data);
    }

    if (sortBy !== "ASC" && sortBy !== "DESC") {
      return res.status(400).json({ error: "sortBy must be ASC or DESC" });
    }

    const order = sortBy === "ASC" ? 1 : -1;

    const rows = await Restaurant.find(
      {},
      { _id: 1, cuisine: 1, name: 1, "address.city": 1, restaurant_id: 1 }
    ).sort({ restaurant_id: order });

    const output = rows.map((r) => ({
      id: r._id,
      cuisines: r.cuisine,
      name: r.name,
      city: r.address?.city || "",
      restaurant_id: r.restaurant_id
    }));

    return res.json(output);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const data = await Restaurant.find({ cuisine });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/restaurants/Delicatessen", async (req, res) => {
  try {
    const rows = await Restaurant.find(
      { cuisine: "Delicatessen", "address.city": { $ne: "Brooklyn" } },
      { _id: 0, cuisine: 1, name: 1, "address.city": 1 }
    ).sort({ name: 1 });

    const output = rows.map((r) => ({
      cuisines: r.cuisine,
      name: r.name,
      city: r.address?.city || ""
    }));

    return res.json(output);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("Lab 03 running ✅"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 http://localhost:${port}`));
