import { ai } from "../lib/gemini.js";
import { Feed } from "../models/feed.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { feedCreateService } from "../services/feedServices.js";
import { feedSchemaValidation } from "../validations/feed.validation.js";
export const feedCreate = async (req, res) => {
  try {
    const requesterId = req.user?._id || req.user?.id;
    const requesterName = req.user?.name;

    const {
      title,
      description,
      skills,
      tags,
      urgency,
      location,
    } = req.body;

    const skillsArray = Array.isArray(skills)
      ? skills.map((s) => s.trim()).filter(Boolean)
      : skills
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    const tagsArray = Array.isArray(tags)
      ? tags
      : tags
        ? [tags]
        : [];

    // 1. CREATE FEED
    const result = await feedCreateService(
      title,
      description,
      requesterId,
      requesterName,
      skillsArray,
      tagsArray,
      urgency,
      location
    );

    // 2. FIND OTHER USERS
    const users = await User.find(
      {
        _id: { $ne: requesterId },
      },
      {
        _id: 1,
      }
    );

    // 3. ONLY CREATE NOTIFICATIONS IF USERS EXIST
    if (users.length > 0) {
      const notifications = users.map((user) => ({
        recipient: user._id,
        sender: requesterId,
        type: "NEW_FEED",
        feed: result._id,
        message: `${requesterName} created a new help request`,
      }));

      await Notification.insertMany(notifications);

      console.log(
        `${notifications.length} notifications created`
      );
    } else {
      console.log("No other users found. No notifications created.");
    }

    // 4. RETURN CREATED FEED
    return res.status(201).json({
      success: true,
      message: "Feed created successfully",
      data: {
        result,
      },
    });
  } catch (error) {
    console.error("FEED CREATE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const suggAI = async (req, res) => {
  const { description, tags, title } = req.body;
  const prompt = `
You are an expert software development assistant.

Analyze the user's request and provide:
1. Improved title
2. Suggested tags
3. Missing details/questions
4. Technical recommendations

User Data:

Title:
${title || "Not provided"}

Description:
${description || "Not provided"}

Tags:
${tags || "Not provided"}

Rules:
- If title exists, improve it.
- If description exists, analyze it and suggest missing information.
- If tags exist, suggest better related tags.
- If only one field is provided, focus on that field.
- If multiple fields are provided, combine them for context.
- If all fields are empty, generate a realistic software development help request and provide title, description, tags, and recommendations yourself.
- Focus on web development, React, Next.js, JavaScript, TypeScript, Node.js, APIs, databases, debugging, and software engineering best practices.

Return ONLY valid JSON:

{
  "improvedTitle": "",
  "descriptionSuggestion": "",
  "tags": [],
}

`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;

    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const json = JSON.parse(clean);

    return res.json(json);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
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
