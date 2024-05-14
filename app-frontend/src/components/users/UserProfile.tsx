import { Avatar, Box, Button, Container, Grid } from "@mui/material";
import { StudentAppBar } from "../students/StudentAppBar";
import { TeacherAppBar } from "../teachers/TeacherAppBar";
import {
  getImage,
  getToken,
  getUserType,
  setImage,
} from "../../utils/auth-utils";
import { useEffect, useState } from "react";
import { UserType } from "../../models/User";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";

export const UserProfile = () => {
  const [userType, setUserType] = useState<UserType>();
  const [user, setUser] = useState({
    name: "",
    email: "",
    nickname: "",
    image: "",
    uniqueIdentificationCode: "",
  });

  useEffect(() => {
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") setUserType(UserType.Teacher);
    else if (userTypeLocalStorage === "1") setUserType(UserType.Student);

    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/users/user-profile`, headers)
      .then((response) => {
        setUser(response.data);

        if (response.data.image !== getImage()) {
          // localStorage.removeItem("image");
          setImage(response.data.image);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          displayErrorMessage(
            "An error occurred while fetching user profile data."
          );
        }
      });
  }, []);

  return (
    <Container>
      {userType === UserType.Student && <StudentAppBar />}
      {userType === UserType.Teacher && <TeacherAppBar />}

      <Box
        sx={{
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          p: 2, // Adjust padding if necessary
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {" "}
            {/* Takes 50% width on extra small screens and above */}
            {/* Content for the left side */}
            <Avatar
              sx={{ width: "10vw", height: "10vw" }}
              //alt="Avatar"
              src={`data:image/jpg;base64,${user.image}`}
            />
          </Grid>
          <Grid item xs={6}>
            Name: {user.name} <br />
            Nickname: {user.nickname} <br />
            Email: {user.email} <br />
            Unique Identification Code: {user.uniqueIdentificationCode}
          </Grid>
        </Grid>

        <Button component={Link} to="/edit-profile" variant="contained">
          Edit Profile
        </Button>
      </Box>
    </Container>
  );
};
