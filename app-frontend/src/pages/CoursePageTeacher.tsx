import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Course } from "../models/Course";
import { BACKEND_URL } from "../constants";
import { Card, CardMedia, Grid, Typography } from "@mui/material";
import axios from "axios";
import { displayErrorMessage } from "../components/ToastMessage";
import { getToken, getUserType } from "../utils/auth-utils";
import { CourseSideBar } from "../components/teachers/CourseSideBar";
import { ShowStudentsAtCourse } from "../components/teachers/ShowStudentsAtCourse";
import { ShowAssignmentsAtCourse } from "../components/teachers/ShowCourseAssignments";
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
