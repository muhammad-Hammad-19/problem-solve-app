import React from "react";
import { UsersFetchProvider } from "../context/UsersContext";
import { UserFeedProvider } from "../context/UserFeedContext";
import { CurrentUserProvider } from "../context/CurrentUserContext";

const Providers = ({ children }) => {
  return (
    <CurrentUserProvider>
      <UserFeedProvider>
        <UsersFetchProvider>
          {children}
        </UsersFetchProvider>
      </UserFeedProvider>
    </CurrentUserProvider>
  );
};

export default Providers;