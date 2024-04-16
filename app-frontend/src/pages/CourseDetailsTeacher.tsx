import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TeacherAppBar } from "../components/TeacherAppBar";
import { Course } from "../models/Course";
import { BACKEND_URL } from "../constants";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import { displayErrorMessage } from "../components/ToastMessage";
import { getToken } from "../utils/auth-utils";

export const CourseDetailsForTeacher = () => {
  const location = useLocation();
  const courseId = location.state;
  const [course, setCourse] = useState<Course>({
    id: -1,
    name: "",
    enrollmentKey: "",
    image: "",
  });

  useEffect(() => {
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/courses/${courseId}`, headers)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          displayErrorMessage("An error occurred while fetching the courses.");
        }
      });
  }, [courseId]);

  return (
    <React.Fragment>
      <TeacherAppBar />
      <Grid
        sx={{
          paddingLeft: "2.5%",
          paddingRight: "2.5%",
          justifyContent: "flex-start",
        }}
      >
        <Card>
          <CardMedia
            sx={{
              position: "relative",
              height: 175,
              width: "100%",
              objectFit: "cover",
            }}
            image={`data:image/jpg;base64,${course.image}`}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "27%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "10px",
              //   zIndex: 1,
              borderRadius: "10px",
              overflow: "hidden",
            }}
            variant="h4"
            component="h2"
          >
            {course.name}
          </Typography>
        </Card>

        <h1> Course with id {courseId} </h1>
      </Grid>
    </React.Fragment>
  );
};
