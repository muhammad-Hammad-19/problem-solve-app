import React from "react";
import { UserProvider } from "../context/UserProvider";
import { UsersFetchProvider } from "../context/UserContext";

const Providers = ({ children }) => {
  return (
    <UserProvider>
      <UsersFetchProvider>{children}</UsersFetchProvider>
    </UserProvider>
  );
};

export default Providers;
