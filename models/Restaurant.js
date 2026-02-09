const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    address: {
      building: String,
      coord: [Number],
      street: String,
      zipcode: String,
      city: String
    },
    borough: String,
    cuisine: String,
    grades: [
      {
        date: Date,
        grade: String,
        score: Number
      }
    ],
    name: String,
    restaurant_id: String
  },
  { collection: "Restaurants" }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
