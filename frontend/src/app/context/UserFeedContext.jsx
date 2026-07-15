"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Unique Name diya
export const UserFeedContext = createContext(null);

export const UserFeedProvider = ({ children }) => {
  const [feeds, setFeeds] = useState([]); // Changed name to 'feeds' for clarity
  const [loading, setLoading] = useState(false);

  const fetchUserFeeds = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/feed/fetch`,
        {
          withCredentials: true,
        },
      );
      setFeeds(res?.data?.data || []);
    } catch (error) {
      console.error("Feed error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFeeds();
  }, []);

  return (
    <UserFeedContext.Provider value={{ feeds, loading, fetchUserFeeds }}>
      {children}
    </UserFeedContext.Provider>
  );
};

export const useUsersFeeds = () => useContext(UserFeedContext);
