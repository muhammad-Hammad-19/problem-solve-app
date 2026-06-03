import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // User field ko String ke bajaye ObjectId banana behtar hai

    // taake aap requester ki profile fetch kar saken
    
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Aapke User model ka naam
      required: true,
    },

    // Ye field store karegi ke kisne madad ki offer ki hai

    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Status track karne ke liye (Sab se zaroori field)

    status: {
      type: String,
      enum: ["Open", "In-Progress", "Solved"],
      default: "Open",
    },

    skills: [{ type: String, required: true }],

    category: {
      type: String,
      enum: ["Development", "Design", "Marketing", "Database", "DevOps"],
      required: true,
    },

    urgency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    location: { type: String, default: "Remote" },

    // AI Features ke liye tags (Optional but recommended)
    tags: [String],
  },
  { timestamps: true },
);

export const Feed = mongoose.model("Feed", feedSchema);
