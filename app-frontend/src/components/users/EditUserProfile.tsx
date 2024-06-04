import { useEffect, useState } from "react";
import { Button, Container, Grid } from "@mui/material";
import React from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";
import { TextField, outlinedInputClasses, styled } from "@mui/material";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { BACKEND_URL } from "../../constants";
import { getToken, getUserType, setEmail } from "../../utils/auth-utils";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
import { UploadImage } from "../teachers/UploadImage";
import { UserType } from "../../models/User";
import { StudentAppBar } from "../app-bars/StudentAppBar";

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
};

const submitButtonStyle = {
  backgroundColor: "#84B1F2",
  color: "white",
  borderRadius: "10px",
  boxShadow: "0 0 10px #84B1F2",
  padding: "3%", // width
  marginTop: "15%",
  marginBottom: "10%",
};

export const EditUserProfile = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>();
  const [imageUrl, setImageUrl] = useState("");
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

  const isValidFileType = (file: File): boolean => {
    return (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
    );
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && isValidFileType(file)) {
      setUser({ ...user, image: event.target.files[0] });
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } else {
      displayErrorMessage("Only select .jpeg, .jpg or .png files.");
    }
  };

  const handleDeleteImage = () => {
    setImageUrl("");
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "userDTO",
      JSON.stringify({
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        UniqueIdentificationCode: user.uniqueIdentificationCode,
      })
    );
    if (user.image) {
      formData.append("image", user.image);
    }

    try {
      await axios.put(`${BACKEND_URL}/users/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      displaySuccessMessage("Your profile was updated successfuly!");
      navigate("/my-profile");

      setEmail(user.email);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage(
          "An error occurred while trying to update profile."
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
        <h2>Edit profile</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <StyledTextField
            required
            id="name"
            label="Name"
            value={user.name}
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) => setUser({ ...user, name: event.target.value })}
          />
          <StyledTextField
            required
            id="email"
            label="Email"
            value={user.email}
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) =>
              setUser({ ...user, email: event.target.value })
            }
          />
          {userType === UserType.Student && (
            <>
              <StyledTextField
                required
                id="nickname"
                label="Nickname"
                value={user.nickname}
                variant="outlined"
                style={textFieldStyle}
                onChange={(event) =>
                  setUser({ ...user, nickname: event.target.value })
                }
              />
              <StyledTextField
                required
                id="uniqueIdCode"
                label="Unique Identification Code"
                value={user.uniqueIdentificationCode}
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
          <UploadImage
            imageUrl={imageUrl}
            handleFileChange={handleFileChange}
            handleDeleteImage={handleDeleteImage}
          />
          <Container />
          <Button type="submit" style={submitButtonStyle}>
            Update profile
          </Button>
        </form>
      </Grid>
    </>
  );
};
