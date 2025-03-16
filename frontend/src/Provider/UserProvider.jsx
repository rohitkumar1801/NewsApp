import React, { useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {

        console.log("error", error.status)

        if (error.status === 401) {
            // User is not logged in, don't log error in console
            setUser(null);
          } else {
            console.error("Error fetching user profile:", error);
          }

       
      }
    };
    fetchUserProfile();
  }, []);

  const loginUser = (userData) => {
    console.log("userData", userData);
    setUser(userData);
  };
  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
