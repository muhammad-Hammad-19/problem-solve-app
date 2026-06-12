import { Feed } from "../models/feed.model.js";

export const feedCreateService = async (
  title,
  description,
  requester,
  requesterName,
  skills,
  category,
  urgency,
  location,
) => {
  const feed = await Feed.create({
    title,
    description,
    requester,
    requesterName,
    skills,
    category,
    urgency,
    location,
  });

  
  return {
    id: feed._id,
    title: feed.title,
    description: feed.description,
    requester: feed.requester,
    requesterName: feed.requesterName,
    skills: feed.skills,
    category: feed.category,
    urgency: feed.urgency,
    location: feed.location,
    createdAt: feed.createdAt,
  };
};
