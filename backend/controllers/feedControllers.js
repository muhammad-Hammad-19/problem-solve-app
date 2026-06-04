import { ai } from "../lib/gemini.js";
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
  "questions": [],
  "recommendations": []
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: 'write 3 time hello world',
    });

    return response.text;
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
