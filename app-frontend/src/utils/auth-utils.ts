import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  const token = localStorage.getItem("token");

  if (token && isValidToken(token)) {
    return localStorage.getItem("token");
  }

  handleLogoutUtil();
  return null;
};

export const getUserType = () => {
  return localStorage.getItem("userType");
};

export const getEmail = () => {
  return localStorage.getItem("email");
};

export const getImage = () => {
  return localStorage.getItem("image");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const setUserType = (userType: string) => {
  localStorage.setItem("userType", userType);
};

export const setEmail = (email: string) => {
  localStorage.setItem("email", email);
};

export const setImage = (image: string) => {
  localStorage.setItem("image", image);
};

export const handleLogoutUtil = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("email");
  localStorage.removeItem("image");

  // user preferences
  localStorage.removeItem("showPoints");
  localStorage.removeItem("showLevels");
  localStorage.removeItem("showBadges");
  localStorage.removeItem("showProgressBars");
  localStorage.removeItem("showLeaderboards");
};

export const isUserLoggedIn = () => {
  const token = localStorage.getItem("token");

  if (token && !isValidToken(token)) {
    handleLogoutUtil();
    return false;
  }

  return true;
};

const isValidToken = (token: string) => {
  const decodedToken = jwtDecode(token);

  if (decodedToken && typeof decodedToken.exp === "number") {
    const expirationDate = decodedToken.exp * 1000;

    if (expirationDate < Date.now()) {
      return false;
    }
  }

  return true;
};
