import { useState } from "react";
import { Button, Container, Grid } from "@mui/material";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
import { UploadImage } from "../teachers/UploadImage";
import React from "react";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { TextField, outlinedInputClasses, styled } from "@mui/material";
import { getToken } from "../../utils/auth-utils";

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

export const AddCoursePage = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [course, setCourse] = useState({
    name: "",
    enrollmentKey: "",
    image: null,
  });

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
      setCourse({ ...course, image: event.target.files[0] });
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
      "courseDTO",
      JSON.stringify({ name: course.name, enrollmentKey: course.enrollmentKey })
    );
    if (course.image) {
      formData.append("image", course.image);
    }

    try {
      await axios.post(`${BACKEND_URL}/courses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      displaySuccessMessage("The course was created successfuly!");
      navigate("/teacher-dashboard");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage("An error occurred while trying to create course.");
      }
    }
  };

  return (
    <React.Fragment>
      <TeacherAppBar />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Create a new course</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <StyledTextField
            required
            id="name"
            label="Name"
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) =>
              setCourse({ ...course, name: event.target.value })
            }
          />
          <UploadImage
            imageUrl={imageUrl}
            handleFileChange={handleFileChange}
            handleDeleteImage={handleDeleteImage}
          />
          <Container />
          <p>
            {" "}
            <b>Note:</b> When the course is created an enrollment key will be
            automatically generated for it, to see it or change it got to the
            course's page.
          </p>
          <Button type="submit" style={submitButtonStyle}>
            Create course
          </Button>
        </form>
      </Grid>
    </React.Fragment>
  );
};
