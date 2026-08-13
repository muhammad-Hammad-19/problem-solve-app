import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requesterName: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Open", "In-Progress", "Solved"],
      default: "In-Progress",
    },

    skills: [
      {
        type: String,
        required: true,
      },
    ],
    
    helpers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Helper",
      },
    ],

    // Tags ko array bana diya hai taake aik se zyada select ho sakein
    tags: [
      { 
        type: String,
        enum: ["Development", "Design", "Marketing", "Database", "DevOps"],
        required: true,
      },
    ],

    urgency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },

    location: {
      type: String,
      default: "Remote",
    },
  },
  { timestamps: true }, // Is se `createdAt` aur `updatedAt` khud bakhud manage ho jayenge
);

export const Feed = mongoose.model("Feed", feedSchema);
