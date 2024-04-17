import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Course } from "../models/Course";
import { BACKEND_URL } from "../constants";
import { Card, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import { displayErrorMessage } from "../components/ToastMessage";
import { getToken } from "../utils/auth-utils";
import { CourseSideBar } from "../components/teachers/CourseSideBar";
import { ShowStudentsAtCourse } from "../components/teachers/ShowStudentsAtCourse";
import { ShowAssignmentsAtCourse } from "../components/teachers/ShowCourseAssignments";

// const leftGridItemStyle = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// };

// const rightGridItemStyle: React.CSSProperties = {
//   backgroundColor: "white",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
// };

export const CoursePageTeacher = () => {
  const location = useLocation();
  const courseId = location.state;
  const [selectedTab, setSelectedTab] = useState("");
  const [course, setCourse] = useState<Course>({
    id: -1,
    name: "",
    enrollmentKey: "",
    image: "",
  });

  const handleTabSelect = (tabName: React.SetStateAction<string>) => {
    setSelectedTab(tabName);
  };

  useEffect(() => {
    const fetchCourse = async () => {
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
            displayErrorMessage(
              "An error occurred while fetching the courses."
            );
          }
        });
    };

    if (courseId != null) {
      fetchCourse();
    }
  }, [courseId]);

  return (
    <React.Fragment>
      {/* <TeacherAppBar /> */}
      <Grid sx={{ flexGrow: 1, height: "100vh" }} container spacing={0}>
        <Grid item xs={2}>
          <CourseSideBar onSelectTab={handleTabSelect} />
          {/* <p>Some stuff here</p> */}
        </Grid>
        <Grid
          item
          xs={10}
          //   sx={{
          //     paddingLeft: "2.5%",
          //     paddingRight: "2.5%",
          //     justifyContent: "flex-start",
          //   }}
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
                borderRadius: "10px",
              }}
              variant="h4"
              component="h2"
            >
              {course.name}
            </Typography>
          </Card>

          {/* <h1> Course with id {courseId} </h1> */}
          {selectedTab === "students" && (
            <ShowStudentsAtCourse courseId={courseId} />
          )}
          {selectedTab === "assignments" && (
            <ShowAssignmentsAtCourse courseId={courseId} />
          )}
          {/* <Routes>
            {/* <Route
              path="*"
              element={<ShowStudentsAtCourse courseId={courseId} />}
            /> */}
          {/* <Route
            path="students"
            element={<ShowStudentsAtCourse courseId={courseId} />}
          />
          <Route
            path="assignments"
            element={<ShowAssignmentsAtCourse courseId={courseId} />}
          /> */}
          {/* </Routes> */}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
