"use client";
import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

// Unique Name diya
export const UsersListContext = createContext(null);

export const UsersFetchProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/user", {
        withCredentials: true,
      });

      const resData = response.data;
      if (resData && resData.data) {
        setUsers(resData.data);
      } else {
        setUsers([]); // Handled direct array
      }
    } catch (error) {
      setUsers([]);
      console.error("Error fetching users:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UsersListContext.Provider value={{ users, isLoading }}>
      {children}
    </UsersListContext.Provider>
  );
};

export const useUsersFetch = () => useContext(UsersListContext);
