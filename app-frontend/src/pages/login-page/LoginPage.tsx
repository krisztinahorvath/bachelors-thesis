import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { User, UserType } from "../../models/User";
import {
  getToken,
  setEmail,
  setImage,
  setNickname,
  setToken,
  setUserType,
} from "../../utils/auth-utils";
import {
  StyledTextField,
  formStyle,
  imageStyle,
  leftGridItemStyle,
  rightGridItemStyle,
  submitButtonStyle,
  textFieldStyle,
} from "./LoginPageStyle";
import Grid from "@mui/material/Grid";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  displayErrorMessage,
  displaySuccessMessage,
} from "../../components/ToastMessage";
import React from "react";
import { HomeAppBar } from "../../components/HomeAppBar";
import { setStudentUserPreferences } from "../../utils/student-user-preferences";

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#ECF3F9";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleUserPreferencesStudent = async () => {
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    await axios
      .get(`${BACKEND_URL}/students/user-preferences`, headers)
      .then((response) => {
        setStudentUserPreferences(response.data);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          displayErrorMessage(
            "An error occurred while fetching the user preferences."
          );
        }
      });
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/users/login`, user);
      setToken(response.data.token);
      setUserType(response.data.userType);
      setEmail(response.data.email);
      setImage(response.data.image);

      if (response.data.userType == 1) setNickname(response.data.nickname);

      displaySuccessMessage("You logged in successfully!");

      if (response.data.userType === UserType.Student) {
        handleUserPreferencesStudent(); // set user preferences
        navigate("/student-dashboard");
      } else if (response.data.userType === UserType.Teacher) {
        navigate("/teacher-dashboard");
      } else {
        displayErrorMessage("An unexpected error occured while logging in");
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage("An error occurred while logging in.");
      }
    }
  };

  return (
    <React.Fragment>
      <HomeAppBar />
      <Grid sx={{ flexGrow: 1, height: "100vh" }} container spacing={0}>
        <Grid item xs={7} style={leftGridItemStyle}>
          <Grid item>
            <a href="https://www.vecteezy.com/free-vector/flat-design">
              <img
                src="/signInPage.jpg"
                alt="Flat Design Vectors by Vecteezy"
                style={imageStyle}
              />
            </a>
          </Grid>
        </Grid>

        <Grid item xs={5} style={rightGridItemStyle}>
          <h1>Welcome back</h1>
          <p> To log into your account please enter your email and password.</p>
          <form onSubmit={handleLogin} style={formStyle}>
            <StyledTextField
              id="email"
              label="Email"
              variant="outlined"
              style={textFieldStyle}
              onChange={(event) =>
                setUser({ ...user, email: event.target.value })
              }
            />
            <StyledTextField
              id="password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              style={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) =>
                setUser({ ...user, password: event.target.value })
              }
            />
            <Button type="submit" style={submitButtonStyle}>
              Log In
            </Button>
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
