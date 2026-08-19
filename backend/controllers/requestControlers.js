import { Feed } from "../models/feed.model.js";
import { Helper } from "../models/helper.model.js";
import { Notification } from "../models/notification.model.js";

export const requestSend = async (req, res) => {
  const requesterId = req.user?._id || req.user?.id;
  const requesterName = req.user?.name;
  const { postId } = req.params;

  try {
    if (!postId || !requesterId || !requesterName) {
      return res.status(400).json({
        message: "Fields are Required",
        successful: false,
      });
    }

    // Specific feed find karo
    const feed = await Feed.findById(postId);

    if (!feed) {
      return res.status(404).json({
        message: "Feed not found",
        successful: false,
      });
    }

    // Check: apni hi post par request na bhej sake
    if (feed.requester.toString() === requesterId.toString()) {
      return res.status(400).json({
        message: "You cannot send a request to your own post",
        successful: false,
      });
    }

    // Check existing request
    const existingRequest = await Helper.findOne({
      postId: postId,
      helperId: requesterId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You have already sent a help request for this problem.",
        successful: false,
      });
    }

    // Helper request create
    const userHelper = await Helper.create({
      postId,
      helperId: requesterId,
      helperName: requesterName,
      isAccepted: true,
    });

    // Feed update
    await Feed.findByIdAndUpdate(postId, {
      status: "In-Progress",
      $push: {
        helpers: userHelper._id,
      },
    });

    // 🔔 Feed owner ko notification
    await Notification.create({
      recipient: feed.requester,
      sender: requesterId,
      type: "HELPER_REQUEST",
      feed: postId,
      message: `${requesterName} sent you a help request`,
    });

    return res.status(201).json({
      message: "Request sent successfully",
      successful: true,
      data: userHelper,
    });
  } catch (error) {
    return res.status(500).json({
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
