import { Helper } from "../models/helper.model.js";

export const requestSend = async (req, res) => {
  const requesterId = req.user?._id || req.user?.id;
  const requesterName = req.user?.name;
  const { postId } = req.params; // ✅ fix
  
  try {
    if (!postId || !requesterId || !requesterName) {
      // ✅ ! added
      return res.status(400).json({
        // ✅ return lagaya
        message: "Fields are Required",
        successful: false,
      });
    }

    const userHelper = await Helper.create({
      postId,
      helperId: requesterId,
      helperName: requesterName,
      isAccepted: true,
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
