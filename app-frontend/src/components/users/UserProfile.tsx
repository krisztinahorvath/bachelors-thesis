import { Avatar, Box, Button, Container, Grid } from "@mui/material";
import { StudentAppBar } from "../app-bars/StudentAppBar";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
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
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export const UserProfile = () => {
  const [userType, setUserType] = useState<UserType>(0);
  const [user, setUser] = useState({
    name: "",
    email: "",
    nickname: "",
    image: "",
    uniqueIdentificationCode: "",
  });

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

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
    <>
      {userType === UserType.Student && <StudentAppBar />}
      {userType === UserType.Teacher && <TeacherAppBar />}
      <Container>
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
                src={`data:image/jpg;base64,${user.image}`}
              />
            </Grid>
            <Grid item xs={6}>
              <strong> Name:</strong> {user.name} <br />
              {userType === UserType.Student && (
                <>
                  {" "}
                  <strong>Nickname:</strong> {user.nickname} <br />
                </>
              )}
              <strong>Email:</strong> {user.email} <br />
              {userType === UserType.Student && (
                <>
                  <strong>Unique Identification Code:</strong>{" "}
                  {user.uniqueIdentificationCode}
                </>
              )}
            </Grid>
          </Grid>

          <Button
            component={Link}
            to="/change-password"
            variant="outlined"
            sx={{ background: "#f3f3f3" }}
          >
            Change Password
          </Button>
          <Button
            component={Link}
            to="/edit-profile"
            variant="outlined"
            sx={{ marginLeft: "2.5%", background: "#f3f3f3" }}
          >
            Edit Profile
          </Button>
          <Button
            color="error"
            sx={{ marginLeft: "2.5%", background: "#f3f3f3" }}
            variant="outlined"
            onClick={() => setOpen(true)}
          >
            Delete Account
          </Button>
        </Box>
      </Container>
      {open && (
        <DeleteAccountDialog
          open={open}
          handleClose={handleClose}
          userType={userType}
        />
      )}
    </>
  );
};
