import { Helper } from "../models/helper.model.js";

export const getHelper = async (req, res) => {
  try {
    const helpers = await Helper.find();

    return res.status(200).json({
      success: true,
      message: "Helpers fetched successfully",
      data: helpers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
