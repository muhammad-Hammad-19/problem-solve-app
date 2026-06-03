import { Feed } from "../models/feed.model.js";

export const feedCreateService = async (
  title,
  description,
  user,
  skills,
  category,
  urgency,
  location,
) => {
  // Create Feed
  const feed = await Feed.create({
    title,
    description,
    user,
    skills,
    category,
    urgency,
    location,
  });

  // Return Response
  return {
    id: feed._id,
    title: feed.title,
    description: feed.description,
    user: feed.user,
    skills: feed.skills,
    category: feed.category,
    urgency: feed.urgency,
    location: feed.location,
    createdAt: feed.createdAt,
  };
};

