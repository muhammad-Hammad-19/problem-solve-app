"use client";
import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

// Unique Name diya
export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Fixed: added missing state

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/user/getUser", {
          // Adjusted URL wrapper if needed
          withCredentials: true,
        });
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

    fetchCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
