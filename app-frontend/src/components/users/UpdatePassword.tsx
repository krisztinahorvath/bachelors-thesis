import { useEffect, useState } from "react";
import { getToken, getUserType } from "../../utils/auth-utils";
import { UserType } from "../../models/User";
import { BACKEND_URL } from "../../constants";
import axios from "axios";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { StudentAppBar } from "../app-bars/StudentAppBar";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  outlinedInputClasses,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#f5f5f5",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#84B1F2",
    },
  [`& .${outlinedInputClasses.root}`]: {
    borderRadius: "10px",
  },
});

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "40%",
};

const textFieldStyle = {
  marginTop: "5%",
  backgroundColor: "#f5f5f5",
  border: "none",
  borderRadius: "10px",
  // height: '20%'
};

const submitButtonStyle = {
  backgroundColor: "#84B1F2",
  color: "white",
  borderRadius: "10px",
  // border: 'none',
  boxShadow: "0 0 10px #84B1F2",
  padding: "3%", // width
  marginTop: "15%",
  marginBottom: "10%",
};

export const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const [userType, setUserType] = useState<UserType>(0);
  const [user, setUser] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleNewPasswordChange = (event: { target: { value: any } }) => {
    const newPswd = event.target.value;

    if (!(newPswd.length >= 8 && /[A-Z]/.test(newPswd) && /\d/.test(newPswd))) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
      setUser({ ...user, newPassword: newPswd });
    }
  };

  const handleClickShowPassword = () => setShowOldPassword((show) => !show);

  const handleClickShowRetypedPassword = () =>
    setShowRetypedPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") setUserType(UserType.Teacher);
    else if (userTypeLocalStorage === "1") setUserType(UserType.Student);
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const userPasswordUpdateDTO = {
      oldPassword: user.oldPassword,
      newPassword: user.newPassword,
    };

    try {
      await axios.patch(
        `${BACKEND_URL}/users/update-password`,
        userPasswordUpdateDTO,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      displaySuccessMessage("Your password was changed successfully!");
      navigate("/my-profile");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage(
          "An error occurred while trying to update your password."
        );
      }
    }
  };

  return (
    <>
      {userType === UserType.Student && <StudentAppBar />}
      {userType === UserType.Teacher && <TeacherAppBar />}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Change password</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <StyledTextField
            required
            id="oldPassword"
            label="Old password"
            variant="outlined"
            type={showOldPassword ? "text" : "password"}
            style={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(event) =>
              setUser({ ...user, oldPassword: event.target.value })
            }
          />
          <StyledTextField
            required
            id="newPassword"
            label="New password"
            variant="outlined"
            type={showRetypedPassword ? "text" : "password"}
            style={textFieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowRetypedPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showRetypedPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleNewPasswordChange}
            error={passwordError}
            helperText={
              passwordError
                ? "The password must have at least 8 characters and must contain at least one upper letter and a digit."
                : ""
            }
          />
          <Button type="submit" style={submitButtonStyle}>
            Save new password
          </Button>
        </form>
      </Grid>
    </>
  );
};
