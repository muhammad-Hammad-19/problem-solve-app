import { Helper } from "../models/helper.model.js";
import { Feed } from "../models/feed.model.js";
import { Notification } from "../models/notification.model.js"; // adjust path to your file

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

    const feed = await Feed.findByIdAndUpdate(postId, {
      status: "In-Progress",
      $push: { helpers: userHelper._id },
    });

    // 🔔 Notify the feed owner that someone offered to help
    if (feed?.userId && feed.userId.toString() !== requesterId.toString()) {
      await Notification.create({
        recipient: feed.userId, // <-- adjust field name, see note below
        sender: requesterId,
        type: "NEW_HELPER",
        feed: postId,
        message: `${requesterName} sent a request to help with your post.`,
      });
    }

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
