import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import { CustomProgressBar } from "../game-elements/CustomProgressBar";
import { CustomizedSteppers } from "../game-elements/Levels";
import { BACKEND_URL } from "../../constants";
import { getToken } from "../../utils/auth-utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { displayErrorMessage } from "../ToastMessage";
import {
  getShowLevels,
  getShowPoints,
  getShowProgressBars,
} from "../../utils/student-user-preferences";

interface AssignmentAndGradeDTO {
  assignmentId: number;
  name: string;
  description: string;
  dueDate: Date;
  weight: number;
  score: number;
  dateReceived: Date;
}

export const GradePageStudent: React.FC<{
  courseData: any;
}> = ({ courseData }) => {
  const [levelsVisibility, setLevelsVisibility] = useState(false);
  const [progressBarsVisibility, setProgressBarsVisibility] = useState(false);
  const [pointsVisibility, setPointsVisibility] = useState(false);

  const [assignments, setAssignments] = useState<AssignmentAndGradeDTO[]>([]);

  const [finalGradeData, setFinalGradeData] = useState({
    finalGrade: 0,
    experiencePoints: 0,
    level: 0,
    experiecenPointsUntilNextLevel: 0,
    gradeUntilNextLevel: 0,
  });

  const [loading, setLoading] = useState(false);
  const xpValue = 300;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (getShowLevels() === "true") setLevelsVisibility(true);
    if (getShowPoints() === "true") setPointsVisibility(true);
    if (getShowProgressBars() === "true") setProgressBarsVisibility(true);

    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    Promise.all([
      axios.get(
        `${BACKEND_URL}/students/student-grades-at-course/${courseData.id}`,
        headers
      ),
      axios.get(
        `${BACKEND_URL}/students/assignments-and-grades/${courseData.id}`,
        headers
      ),
    ])
      .then(([finalGradeResponse, assignmentsResponse]) => {
        setFinalGradeData(finalGradeResponse.data);

        setAssignments(assignmentsResponse.data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        setLoading(false);
        displayErrorMessage("An error occurred while fetching the data.");
      });
  }, []);

  return (
    <>
      {!loading && assignments.length === 0 && (
        <h2>
          Nothing to display, no assignments that could have grades exist.
        </h2>
      )}

      {!loading && assignments.length !== 0 && (
        <Container>
          <h2>Grades at {courseData.name}</h2>
          <Container sx={{ width: "80%", marginBottom: "20px" }}>
            {progressBarsVisibility && (
              <>
                <Tooltip
                  title={`You have completed ${Math.round(
                    finalGradeData.finalGrade * 10
                  )}% of the course work.`}
                  arrow
                >
                  <div>
                    <CustomProgressBar
                      value={Math.round(finalGradeData.finalGrade * 10)}
                    />
                  </div>
                </Tooltip>

                <p>
                  {/* Course work progress. */}
                  You have completed{" "}
                  <strong>
                    {Math.round(finalGradeData.finalGrade * 10)}%
                  </strong>{" "}
                  of the course work.
                </p>
              </>
            )}{" "}
          </Container>
          <Container
            sx={{
              marginBottom: "30px",
              "@media (min-width: 768px)": {
                minWidth: "70%", // set minWidth to 70% for screens wider than 768px
                width: "70%", // unset width to allow minWidth to take effect
              },
            }}
          >
            {levelsVisibility ? (
              <>
                <CustomizedSteppers activeSteps={finalGradeData.level - 1} />
                {pointsVisibility ? (
                  <p>
                    You have{" "}
                    <strong>{finalGradeData.experiencePoints} XP</strong>.
                    {finalGradeData.experiecenPointsUntilNextLevel > 0 ? (
                      <>
                        {" "}
                        You need an additonal{" "}
                        <strong>
                          {Math.round(
                            finalGradeData.experiecenPointsUntilNextLevel
                          )}{" "}
                          XP
                        </strong>{" "}
                        to reach{" "}
                        <strong>Level {finalGradeData.level + 1}</strong>.
                      </>
                    ) : (
                      <> Congratulations! You've reached the final level!</>
                    )}
                  </p>
                ) : (
                  <p>
                    You have{" "}
                    <strong>{finalGradeData.finalGrade} points </strong>.
                    {finalGradeData.gradeUntilNextLevel > 0 ? (
                      <>
                        {" "}
                        You need an additonal{" "}
                        <strong>
                          {finalGradeData.gradeUntilNextLevel} point(s)
                        </strong>{" "}
                        to reach{" "}
                        <strong>Level {finalGradeData.level + 1}</strong>.
                      </>
                    ) : (
                      <> Congratulations!. You've reached the final level!</>
                    )}
                  </p>
                )}
              </>
            ) : (
              <>
                {pointsVisibility ? (
                  <p>
                    You have{" "}
                    <strong>{finalGradeData.experiencePoints} XP</strong>.
                  </p>
                ) : (
                  <p>
                    You have{" "}
                    <strong>{finalGradeData.finalGrade} points </strong>.
                  </p>
                )}
              </>
            )}
          </Container>

          <Container
            sx={{
              marginTop: "5%",
              "@media (min-width: 768px)": {
                minWidth: "70%", // set minWidth to 70% for screens wider than 768px
                width: "85%", // unset width to allow minWidth to take effect
              },
            }}
          >
            {loading && <CircularProgress />}
            {!loading && assignments.length === 0 && (
              <p>No assignments to display.</p>
            )}

            {!loading && assignments.length > 0 && (
              <Container>
                {assignments.map((card, index) => (
                  <Card key={index} sx={{ marginBottom: 2, height: "10%" }}>
                    <CardContent sx={{ textAlign: "left" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{ fontSize: "1rem" }}
                          >
                            <strong>{card.name}</strong>
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          {pointsVisibility ? (
                            card.dateReceived.toString() !==
                            "0001-01-01T00:00:00" ? (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {((card.score * card.weight) / 100) * xpValue} /{" "}
                                {(card.weight / 10) * xpValue} XP
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                / {(card.weight / 10) * xpValue} XP
                              </Typography>
                            )
                          ) : card.dateReceived.toString() !==
                            "0001-01-01T00:00:00" ? (
                            <Typography variant="body2" color="text.secondary">
                              {(card.score * card.weight) / 100} /{" "}
                              {card.weight / 10} points
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              / {card.weight / 10} points
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      {card.dateReceived.toString() !==
                        "0001-01-01T00:00:00" && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Graded on: </strong>
                          {formatDate(card.dateReceived)}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Container>
            )}
          </Container>
        </Container>
      )}
    </>
  );
};
