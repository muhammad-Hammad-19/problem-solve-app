"use client";
import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";

// 1. Context Create kiya
export const UserContext = createContext(null);

// 2. Provider Component banaya
export const UsersFetchProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loader ke liye state add ki

  useEffect(() => {
    // Async function ko useEffect ke andar banaya taake React crash na ho
    const fetchUsers = async () => {
      try {
        setIsLoading(true); // Fetch shuru hone se pehle loader on

        const response = await axios.get("http://localhost:5000/user", {
          withCredentials: true,
        });

        const resData = response.data; // Axios mein data 'response.data' mein hota ha

        // Agar aapka backend data ko "data" key ke andar bhej raha hai (e.g., res.json({ data: [...] }))
        if (resData && resData.data) {
          setUsers(resData.data);
        } else {
          // Agar backend direct array bhej raha hai
          setUsers(resData);
        }
      } catch (error) {
        setUsers(null);
        console.error("Error fetching users:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Value mein 'users' ke sath 'isLoading' bhi pass kiya taake components loader dikha sakein
  return (
    <UserContext.Provider value={{ users, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserFetch = () => useContext(UserContext);
