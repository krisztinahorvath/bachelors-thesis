import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
} from "@mui/material";
import studentSVG from "../../assets/studentRegister.svg";
import teacherSVG from "../../assets/teacherRegister.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../models/User";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import axios from "axios";
import {
  displaySuccessMessage,
  displayErrorMessage,
} from "../../components/ToastMessage";
import { BACKEND_URL } from "../../constants";
import {
  StyledTextField,
  formStyle,
  submitButtonStyle,
  textFieldStyle,
} from "./RegisterPageStyle";
import { HomeAppBar } from "../../components/app-bars/HomeAppBar";
import { UserRegisterDTO } from "../../models/UserRegisterDTO";

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordValueError, setShowPasswordValueError] = useState(false);
  const [showRetypedPassword, setShowRetypedPassword] = useState(false);
  const [retypedPasswordError, setRetypedPasswordError] = useState(false);
  const [retypedPassword, setRetypedPassword] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState<UserRegisterDTO>({
    name: "",
    email: "",
    password: "",
    userType: UserType.Teacher,
    nickname: "",
    uniqueIdentificationCode: "",
  });

  const handlePasswordChange = (event: { target: { value: any } }) => {
    const newPassword = event.target.value;
    setUser({ ...user, password: newPassword });

    if (
      !(
        newPassword.length >= 8 &&
        /[A-Z]/.test(newPassword) &&
        /\d/.test(newPassword)
      )
    ) {
      setShowPasswordValueError(true);
    } else setShowPasswordValueError(false);

    if (retypedPassword && newPassword !== retypedPassword) {
      setRetypedPasswordError(true);
    } else {
      setRetypedPasswordError(false);
    }
  };

  const handleRetypePasswordChange = (event: { target: { value: any } }) => {
    const retypePassword = event.target.value;
    setRetypedPassword(retypePassword);

    if (user.password && retypePassword !== user.password) {
      setRetypedPasswordError(true);
    } else {
      setRetypedPasswordError(false);
      setUser({ ...user, password: retypePassword });
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowRetypedPassword = () =>
    setShowRetypedPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [isStudentSelected, setIsStudentSelected] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsStudentSelected(event.target.value === "student");
  };

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    return emailRegex.test(email);
  }

  const handleRegister = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (showPasswordValueError || retypedPasswordError) {
      displayErrorMessage(
        "Make sure your passwords match and are of the required form."
      );
      return;
    }
    if (!isValidEmail(user.email)) {
      displayErrorMessage("Email must be of the form: example@domain.com");
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/users/register`, user);

      displaySuccessMessage("Your account was created successfully!");
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage("An error occurred while creating your account.");
      }
    }
  };

  return (
    <React.Fragment>
      <HomeAppBar />

      <h1>Create an account</h1>
      <FormControl component="fieldset">
        <FormLabel component="legend" id="demo-row-radio-buttons-group-label">
          Choose account type{" "}
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          row
          value={isStudentSelected ? "student" : "teacher"}
          onChange={handleRadioChange}
        >
          <Grid
            item
            xs={6}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <FormControlLabel
              style={{ marginLeft: "60%" }}
              value="student"
              control={<Radio />}
              label={
                <div>
                  <img
                    src={studentSVG}
                    alt="student"
                    style={{ width: "70%" }}
                  />
                  <div style={{ textAlign: "center" }}>Student</div>
                </div>
              }
              labelPlacement="top"
              onChange={() => setUser({ ...user, userType: UserType.Student })}
            />
          </Grid>

          <Grid
            item
            xs={6}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <FormControlLabel
              style={{ marginRight: "60%" }}
              value="teacher"
              control={<Radio />}
              label={
                <div>
                  <img
                    src={teacherSVG}
                    alt="teacher"
                    style={{ width: "70%" }}
                  />
                  <div style={{ textAlign: "center" }}>Teacher</div>
                </div>
              }
              labelPlacement="top"
              onChange={() => setUser({ ...user, userType: UserType.Teacher })}
            />
          </Grid>
        </RadioGroup>
      </FormControl>

      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <form onSubmit={handleRegister} style={formStyle}>
          <StyledTextField
            required
            id="name"
            label="Name"
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) => setUser({ ...user, name: event.target.value })}
          />
          <StyledTextField
            required
            id="email"
            label="Email"
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) =>
              setUser({ ...user, email: event.target.value })
            }
          />
          <StyledTextField
            required
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
            onChange={handlePasswordChange}
            error={showPasswordValueError}
            helperText={
              showPasswordValueError
                ? "The password must have at least 8 characters and must contain at least one upper letter and a digit."
                : ""
            }
          />
          <StyledTextField
            required
            id="retype-password"
            label="Retype password"
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
            onChange={handleRetypePasswordChange}
            error={retypedPasswordError}
            helperText={retypedPasswordError ? "Passwords do not match." : ""}
          />
          {isStudentSelected && (
            <>
              <StyledTextField
                required
                id="nickname"
                label="Nickname"
                variant="outlined"
                style={textFieldStyle}
                onChange={(event) =>
                  setUser({ ...user, nickname: event.target.value })
                }
              />
              <StyledTextField
                required
                id="idcode"
                label="Your unique identification code provided by your institution"
                variant="outlined"
                style={textFieldStyle}
                onChange={(event) =>
                  setUser({
                    ...user,
                    uniqueIdentificationCode: event.target.value,
                  })
                }
              />
            </>
          )}
          <Button type="submit" style={submitButtonStyle}>
            Create account
          </Button>
        </form>
      </Grid>
    </React.Fragment>
  );
};
