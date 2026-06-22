import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id || req.user?.id;

    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password",
    );

    return res.status(200).json({
      success: true,
      message: "Fetch Users Successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUser = (req, res) => {
  const loginUser = req.user;
  res.status(200).json({
    user: loginUser,
    message: "user login",
  });
};
