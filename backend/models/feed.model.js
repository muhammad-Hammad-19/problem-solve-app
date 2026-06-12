import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // Jis bande ne request add ki hai uski ID
    
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requesterName: {
      type: String,
      required: true,
      trim: true
    },

    // Shuru me koi helper nahi hoga (null), jab koi madad accept karega tab uski ID store hogi
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    
    // Jab post create hogi, toh by default "In-Progress" status hoga
    status: {
      type: String,
      enum: ["Open", "In-Progress", "Solved"],
      default: "In-Progress", 
    },

    skills: [{ 
      type: String, 
      required: true 
    }],

    // Tags ko array bana diya hai taake aik se zyada select ho sakein
    tags: [{
      type: String,
      enum: ["Development", "Design", "Marketing", "Database", "DevOps"],
      required: true,
    }],

    urgency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },

    location: { 
      type: String, 
      default: "Remote" 
    },
    
  },
  { timestamps: true }, // Is se `createdAt` aur `updatedAt` khud bakhud manage ho jayenge
);

export const Feed = mongoose.model("Feed", feedSchema);