import { Container } from "@mui/material";
import { StudentAppBar } from "./StudentAppBar";
import { useLocation } from "react-router-dom";
import { CustomProgressBar } from "../game-elements/CustomProgressBar";
import { CustomizedSteppers } from "../game-elements/Levels";
import { BACKEND_URL } from "../../constants";
import { getToken } from "../../utils/auth-utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { displayErrorMessage } from "../ToastMessage";
import {
  getShowLevels,
  getShowProgressBars,
} from "../../utils/student-user-preferences";

export const GradePageStudent = () => {
  const location = useLocation();
  const courseData = location.state;
  const [levelsVisibility, setLevelsVisibility] = useState(false);
  const [progressBarsVisibility, setProgressBarsVisibility] = useState(false);
  const [level, setLevel] = useState(-1);
  const [pointsLeftUntilNextLevel, setPointsLeftUntilNextLevel] = useState(0);
  const xpValue = 300;

  const [studentData, setStudentData] = useState({
    finalGrade: 0,
    experiencePoints: 0,
  });

  const [loading, setLoading] = useState(false);

  const computeLevel = (grade: number) => {
    if (grade < 2) {
      setLevel(1);
      setPointsLeftUntilNextLevel((2 - grade) * xpValue);
    } else if (grade >= 2 && grade < 4) {
      setLevel(2);
      setPointsLeftUntilNextLevel((4 - grade) * xpValue);
    } else if (grade >= 4 && grade < 6.5) {
      setLevel(3);
      setPointsLeftUntilNextLevel((6.5 - grade) * xpValue);
    } else if (grade >= 6.5 && grade < 9.5) {
      setLevel(4);
      setPointsLeftUntilNextLevel((9.5 - grade) * xpValue);
    } else setLevel(5);
  };

  useEffect(() => {
    if (getShowLevels() === "true") setLevelsVisibility(true);
    if (getShowProgressBars() === "true") setProgressBarsVisibility(true);

    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(
        `${BACKEND_URL}/students/student-grades-at-course/${courseData.courseId}`,
        headers
      )
      .then((response) => {
        setStudentData(response.data);
        computeLevel(response.data.finalGrade);
        setLoading(false);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage("An error occurred while fetching the data.");
        }
      });
  }, []);

  return (
    <Container>
      <StudentAppBar />
      <h2>Grades at {courseData.courseName}:</h2>
      <Container sx={{ width: "70%", minWidth: "70%" }}>
        {progressBarsVisibility && (
          <CustomProgressBar value={studentData.finalGrade * 10} />
        )}{" "}
      </Container>
      <Container
        sx={{
          //width: "100%", // set width to 100% by default
          "@media (min-width: 768px)": {
            minWidth: "70%", // set minWidth to 70% for screens wider than 768px
            width: "70%", // unset width to allow minWidth to take effect
          },
        }}
      >
        {levelsVisibility && (
          <>
            {" "}
            <CustomizedSteppers activeSteps={level - 1} />
            <p>
              You have <strong>{studentData.experiencePoints} XP</strong>.
              {pointsLeftUntilNextLevel > 0 ? (
                <>
                  {" "}
                  You need an additonal{" "}
                  <strong>{Math.round(pointsLeftUntilNextLevel)} XP</strong> to
                  reach <strong>Level {level + 1}</strong>.
                </>
              ) : (
                <> Congratulations, you've reached the final level!</>
              )}
            </p>
          </>
        )}
      </Container>
    </Container>
  );
};
