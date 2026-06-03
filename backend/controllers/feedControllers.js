import { Feed } from "../models/feed.model.js";
import { feedCreateService } from "../services/feedServices.js";
import { feedSchemaValidation } from "../validations/feed.validation.js";

export const feedCreate = async (req, res) => {
  try {
    const { title, description, user, skills, category, urgency, location } =
      req.body;

    const { error } = feedSchemaValidation.validate(req.body);
    // Validation
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // Service Call
    const result = await feedCreateService(
      title,
      description,
      user,
      skills,
      category,
      urgency,
      location,
    );

    return res.status(201).json({
      success: true,
      message: "Feed created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const suggAI = (req, res) => {
  try {
    
  } catch (error) {
    console.log(error.message);
  }
};

export const feedFetch = async (req, res) => {
  try {
    const feeds = await Feed.find();

    res.status(200).json({
      success: true,
      data: feeds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
