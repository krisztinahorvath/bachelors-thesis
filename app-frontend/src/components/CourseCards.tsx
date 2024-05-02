import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../constants";
import { Course } from "../models/Course";
import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth-utils";
import axios from "axios";
import { displayErrorMessage } from "./ToastMessage";
import { CircularProgress, Container } from "@mui/material";
import { UserType } from "../models/User";

export const CourseCards: React.FC<{ userType: UserType }> = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setLoading(true);
    let url;
    if (userType == UserType.Teacher) url = "courses-of-teacher";
    else if (userType == UserType.Student) url = "courses-of-student";

    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/courses/${url}`, headers)
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage("An error occurred while fetching the courses.");
        }
      });
  }, []);

  return (
    <Container>
      {loading && <CircularProgress />}
      {!loading && courses.length === 0 && <p>No courses to display.</p>}
      {!loading && courses.length > 0 && (
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={3} key={course.id}>
              <Link
                to={`/course/${index + 1}/details`}
                state={course.id}
                title="View course details"
              >
                {" "}
                {/* send the course id to the page but dont show its id */}
                <Card>
                  <CardMedia
                    sx={{ height: 100 }}
                    image={`data:image/jpg;base64,${course.image}`}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" component="h2">
                      {course.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
