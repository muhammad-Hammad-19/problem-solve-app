import { Feed } from "../models/feed.model.js";
import { Helper } from "../models/helper.model.js";

export const requestSend = async (req, res) => {
  const requesterId = req.user?._id || req.user?.id;
  const requesterName = req.user?.name;
  const { postId } = req.params; // ✅ fix

  try {
    if (!postId || !requesterId || !requesterName) {
      return res.status(400).json({
        message: "Fields are Required",
        successful: false,
      });
    }

    let existingRequest = await Helper.findOne({
      postId: postId,
      helperId: requesterId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already sent a help request for this problem.",
        successful: false,
      });
    }

    const userHelper = await Helper.create({
      postId,
      helperId: requesterId,
      helperName: requesterName,
      isAccepted: true,
    });

    await Feed.findByIdAndUpdate(postId, {
      status: "In-Progress",
      $push: { helpers: userHelper._id }, // ✅ helper ID feed mein save
    });

    return res.status(201).json({
      message: "Request sent successfully",
      successful: true,
      data: userHelper,
    });
  } catch (error) {
    return res.status(500).json({
      // ✅ catch fix
      message: "Internal Server Error",
      successful: false,
      error: error.message,
    });
  }
};

export const requestFetch = async (req, res) => {
  const fetchHelepers = await Helper.find();
  const helperCounter = {};

  fetchHelepers.forEach((data) => {
    if (helperCounter[data.helperName]) {
      helperCounter[data.helperName]++;
    } else {
      helperCounter[data.helperName] = 1;
    }
  });

  res.status(200).json({
    helperCounter,
    successful: true,
  });
};
