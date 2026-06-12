import { ai } from "../lib/gemini.js";
import { Feed } from "../models/feed.model.js";
import { feedCreateService } from "../services/feedServices.js";
import { feedSchemaValidation } from "../validations/feed.validation.js";

export const feedCreate = async (req, res) => {
  try {
    // Agar aapka auth middleware req.user set karta hai:
    const requesterId = req.user?._id || req.user?.id; 
    const requesterName = req.user?.name;

    const {
      title,
      description,
      skills, // Yeh string hogi frontend se: "React, Node"
      tags,   // Backend me 'category' ki jagah 'tags' use karein
      urgency,
      location,
    } = req.body;

    // String ko Array me convert karein database ke liye
    const skillsArray = skills ? skills.split(",").map(s => s.trim()) : [];
    
    // Agar frontend se sirf 1 tag aa raha hai string me, usay array bana dein
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

    // Service Call me requesterId zaroor pass karein
    const result = await feedCreateService(
      title,
      description,
      requesterId,     // NAYA: ID pass karein
      requesterName,
      skillsArray,     // NAYA: Array pass karein
      tagsArray,       // NAYA: tags array pass karein
      urgency,
      location
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
