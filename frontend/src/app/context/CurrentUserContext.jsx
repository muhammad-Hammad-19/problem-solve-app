"use client";
import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

// Unique Name diya
export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Fixed: added missing state

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/getUser`,
        {
          withCredentials: true,
        },
      );
      const resData = response.data.user;

      if (resData) {
        setCurrentUser(resData);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      setCurrentUser(null);
      console.error("Error fetching profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, isLoading, fetchCurrentUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
