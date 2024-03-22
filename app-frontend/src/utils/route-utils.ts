import React, { useEffect } from "react";
import {useNavigate } from "react-router-dom";
import {UserType } from "../models/User";
import {getToken, getUserType } from "./auth-utils";

interface Props {
  element: JSX.Element;
  path?: string;
  allowedUsers: Array<UserType>;
}

export const PrivateRoute: React.FC<Props> = ({ element: RouteElement, allowedUsers }) => {
    const userType = getUserType();
    const isAuthenticated = getToken() !== null;
    const userTypeAllowed = userType && allowedUsers.includes(parseInt(userType as string));
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!isAuthenticated || !userTypeAllowed) {
        navigate("/");
      }
    }, [isAuthenticated, userTypeAllowed, navigate]);
  
    if (isAuthenticated && userTypeAllowed) {
      return RouteElement;
    }
  
    return null;
  };
  
