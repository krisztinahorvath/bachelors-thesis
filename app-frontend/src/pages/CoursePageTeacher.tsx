import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Course } from "../models/Course";
import { BACKEND_URL } from "../constants";
import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import { displayErrorMessage } from "../components/ToastMessage";
import { getToken, getUserType } from "../utils/auth-utils";
import { CourseSideBar } from "../components/teachers/CourseSideBar";
import { ShowStudentsAtCourse } from "../components/teachers/ShowStudentsAtCourse";
import { ShowAssignmentsAtCourse } from "../components/assignments/ShowCourseAssignments";
import { ShowAllGradesAndAssignments } from "../components/teachers/ShowAllGradesAndAssignments";
import { TeacherAppBar } from "../components/teachers/TeacherAppBar";
import { UserType } from "../models/User";
import { CourseSideBarStudent } from "../components/students/CourseSideBarStudent";
import { StudentAppBar } from "../components/students/StudentAppBar";

export const CoursePageTeacher = () => {
  const { courseIndex } = useParams<{ courseIndex: string }>();
  const [userType, setUserType] = useState<UserType>();
  const navigate = useNavigate();

  const location = useLocation();
  const courseId = location.state;
  const [selectedTab, setSelectedTab] = useState("details");
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
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") setUserType(UserType.Teacher);
    else if (userTypeLocalStorage === "1") setUserType(UserType.Student);

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

  useEffect(() => {
    if (selectedTab === "leaderboard") {
      // Ensure courseId is set before navigating
      if (course.id && courseIndex) {
        navigate(`/course/${courseIndex}/leaderboard`, {
          state: { courseId: course.id, courseName: course.name },
        });
        setSelectedTab("");
      } else {
        // Handle the case where course data is not available yet
        console.log("Course data is not available yet.");
      }
    } else if (selectedTab === "grades" && userType === UserType.Student) {
      if (course.id && courseIndex) {
        navigate(`/course/${courseIndex}/my-grades`, {
          state: { courseId: course.id, courseName: course.name },
        });
        setSelectedTab("");
      } else {
        // Handle the case where course data is not available yet
        console.log("Course data is not available yet.");
      }
    }
  }, [selectedTab, course, courseIndex, navigate]);

  return (
    <React.Fragment>
      {userType === UserType.Teacher && <TeacherAppBar />}
      {userType === UserType.Student && <StudentAppBar />}

      <Grid sx={{ flexGrow: 1, height: "100vh" }} container spacing={0}>
        <Grid item xs={2}>
          {userType === UserType.Teacher && (
            <CourseSideBar onSelectTab={handleTabSelect} />
          )}
          {userType === UserType.Student && (
            <CourseSideBarStudent onSelectTab={handleTabSelect} />
          )}
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
          {selectedTab === "details" && (
            <Card sx={{ width: "90%", marginLeft: "7%", position: "relative" }}>
              <CardMedia
                sx={{
                  height: 161,
                  width: "100%",
                  objectFit: "cover",
                  "@media (max-width: 600px)": {
                    height: 209,
                  },
                }}
                image={`data:image/jpg;base64,${course.image}`}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    padding: {
                      xs: "5px",
                      sm: "7px",
                      md: "10px",
                      lg: "10px",
                      xl: "10px",
                    },
                    borderRadius: "10px",
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.5rem",
                      md: "1.8rem",
                      lg: "2rem",
                      xl: "3rem",
                    },
                    maxWidth: "90%",
                    overflowWrap: "break-word",
                  }}
                  variant="h4"
                  component="h2"
                >
                  {course.name}
                </Typography>
              </Box>
            </Card>
          )}

          {selectedTab === "students" && (
            <ShowStudentsAtCourse courseId={courseId} />
          )}
          {selectedTab === "assignments" && (
            <ShowAssignmentsAtCourse courseId={courseId} />
          )}
          {selectedTab === "grades" && (
            <ShowAllGradesAndAssignments courseId={courseId} />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
