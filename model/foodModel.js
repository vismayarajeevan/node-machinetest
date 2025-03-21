const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true
     },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
