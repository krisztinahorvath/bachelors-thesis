import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Course } from "../../models/Course";
import { BACKEND_URL } from "../../constants";
import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import { displayErrorMessage } from "../ToastMessage";
import { getToken, getUserType } from "../../utils/auth-utils";
import { CourseSideBar } from "../teachers/CourseSideBar";
import { ShowStudentsAtCourse } from "../teachers/ShowStudentsAtCourse";
import { ShowAssignmentsAtCourse } from "../assignments/ShowCourseAssignments";
import { ShowAllGradesAndAssignments } from "../teachers/ShowAllGradesAndAssignments";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
import { UserType } from "../../models/User";
import { CourseSideBarStudent } from "../students/CourseSideBarStudent";
import { StudentAppBar } from "../app-bars/StudentAppBar";
import { StudentAchievements } from "../game-elements/Badges";
import { CourseDetailsComponent } from "./CourseDetailsComponent";
import { GradePageStudent } from "../students/GradePageStudent";
import { Leaderboard } from "../game-elements/Leaderboard";

export const CoursePage = () => {
  const { courseIndex } = useParams<{ courseIndex: string }>();
  const [userType, setUserType] = useState<UserType>();

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
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") setUserType(UserType.Teacher);
    else if (userTypeLocalStorage === "1") setUserType(UserType.Student);

    const fetchCourse = async () => {
      const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
      axios
        .get(`${BACKEND_URL}/courses/${courseId}`, headers)
        .then((response) => {
          setCourse(response.data);
          setSelectedTab("details");
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
        <Grid item xs={10}>
          {selectedTab === "details" && (
            <>
              <Card
                sx={{ width: "90%", marginLeft: "7%", position: "relative" }}
              >
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
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
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
              <CourseDetailsComponent
                courseData={course}
                courseIndex={courseIndex}
              />
            </>
          )}

          {selectedTab === "students" && (
            <ShowStudentsAtCourse courseId={courseId} />
          )}
          {selectedTab === "assignments" && (
            <ShowAssignmentsAtCourse courseId={courseId} />
          )}
          {userType === UserType.Teacher && selectedTab === "grades" && (
            <ShowAllGradesAndAssignments courseId={courseId} />
          )}
          {userType === UserType.Student && selectedTab === "achievements" && (
            <StudentAchievements courseData={course} />
          )}
          {userType === UserType.Student && selectedTab === "grades" && (
            <GradePageStudent courseData={course} />
          )}
          {userType === UserType.Student && selectedTab === "leaderboard" && (
            <Leaderboard courseData={course} />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
