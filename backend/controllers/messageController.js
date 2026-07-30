import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { otherUserId } = req.params;
    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId zaroori hai" });
    }
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // purane message pehle, naye baad me (chat order)

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Messages fetch nahi ho sake" });
  }
  
};
