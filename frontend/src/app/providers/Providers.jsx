import React from "react";
import { UserProvider } from "../context/UserProvider";

const Providers = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default Providers;
