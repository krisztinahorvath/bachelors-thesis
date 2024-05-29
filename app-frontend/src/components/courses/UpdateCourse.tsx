import { useLocation, useNavigate } from "react-router-dom";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
import { Course } from "../../models/Course";
import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  outlinedInputClasses,
  styled,
} from "@mui/material";
import axios from "axios";
import { getToken } from "../../utils/auth-utils";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { BACKEND_URL } from "../../constants";
import { UploadImage } from "../teachers/UploadImage";

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

export const UpdateCourse = () => {
  const location = useLocation();
  const courseData = location.state;
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [course, setCourse] = useState<Course>(courseData);

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
      // setImageData(event.target.files[0]);
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
      JSON.stringify({
        id: course.id,
        name: course.name,
      })
    );
    if (course.image) {
      formData.append("image", course.image);
    }

    try {
      console.log(formData);
      console.log(course);

      await axios.put(`${BACKEND_URL}/courses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      displaySuccessMessage("The course was updated successfuly!");
      navigate(-1);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage(
          "An error occurred while trying to update the course."
        );
      }
    }
  };

  return (
    <>
      <TeacherAppBar />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Update course</h2>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "80%", sm: "40%" },
          }}
        >
          <StyledTextField
            required
            id="name"
            label="Name"
            value={course?.name}
            variant="outlined"
            style={textFieldStyle}
            InputLabelProps={{ shrink: true }}
            onChange={(event) =>
              setCourse({ ...course, name: event.target.value })
            }
          />
          <UploadImage
            imageUrl={imageUrl}
            handleFileChange={handleFileChange}
            handleDeleteImage={handleDeleteImage}
          />
          <Button type="submit" style={submitButtonStyle}>
            Update course
          </Button>
        </Box>
      </Grid>
    </>
  );
};
