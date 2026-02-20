/**
 * Feedback Model
 * Defines the schema for feedback documents in MongoDB
 */

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "general",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "archived"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Create and export the Feedback model
const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
