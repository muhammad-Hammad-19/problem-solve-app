import mongoose from "mongoose";
const helperSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    helperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helperName: {
      type: String,
      ref: "User",
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // createdAt aur updatedAt auto ban jayenge
  },
);

export const Helper = mongoose.model("Helper", helperSchema);
