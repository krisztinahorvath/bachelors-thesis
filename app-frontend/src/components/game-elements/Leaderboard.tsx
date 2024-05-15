import {
  Avatar,
  Box,
  Card,
  // CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { StudentAppBar } from "../students/StudentAppBar";
import { useEffect, useState } from "react";
import { getNickname, getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";
import Number1 from "../../assets/nr1.svg";
import Number2 from "../../assets/nr2.svg";
import Number3 from "../../assets/nr3.svg";

interface LeaderboardDTO {
  image?: string;
  nickname: string;
  finalGrade: number;
  experiencePoints: number;
  rank?: number;
}

const Number1Badge = () => {
  return <img src={Number1} alt="airplane" style={{ width: "45px" }} />;
};

const Number2Badge = () => {
  return <img src={Number2} alt="airplane" style={{ width: "40px" }} />;
};

const Number3Badge = () => {
  return <img src={Number3} alt="airplane" style={{ width: "40px" }} />;
};

export const Leaderboard = () => {
  const location = useLocation();
  const courseData = location.state;
  const currStudNickname = getNickname();

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<LeaderboardDTO[]>([]);

  useEffect(() => {
    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };

    axios
      .get(`${BACKEND_URL}/courses/leaderboard/${courseData.courseId}`, headers)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage(
            "An error occurred while fetching the assignments."
          );
        }
      });
  }, []);

  return (
    <Container>
      <StudentAppBar />
      {loading && <CircularProgress />}
      {!loading && students.length === 0 && (
        <p>No students to display for the leaderboard.</p>
      )}

      {!loading && students.length > 0 && (
        <Container sx={{ width: "80%" }}>
          <h2> Leaderboard for {courseData.courseName}:</h2>
          {students.map((student, index) => (
            <Card
              key={index}
              sx={{
                marginBottom: 2,
                backgroundColor:
                  student.nickname === currStudNickname ? "#e8f4f8" : "white", // Conditionally set the background color
              }}
            >
              {/* <CardActionArea> */}
              <CardContent sx={{ textAlign: "left" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box display="flex" alignItems="center">
                    {student.rank === 1 && <Number1Badge />}
                    {student.rank === 2 && <Number2Badge />}
                    {student.rank === 3 && <Number3Badge />}
                    {student.rank !== 1 &&
                      student.rank !== 2 &&
                      student.rank !== 3 && (
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            margin: "auto",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                          }}
                        >
                          {student.rank}
                        </Typography>
                      )}
                  </Box>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ width: 40, height: 40 }}
                      src={`data:image/jpg;base64,${student.image}`}
                    />
                    <Box>
                      <Typography
                        gutterBottom
                        component="div"
                        sx={{ fontSize: "0.875rem", fontWeight: "bold" }}
                      >
                        {student.nickname === currStudNickname
                          ? `${student.nickname} (You)`
                          : student.nickname}
                        {/* {student.nickname} */}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Points: {student.experiencePoints} XP
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
              {/* </CardActionArea> */}
            </Card>
          ))}
        </Container>
      )}
    </Container>
  );
};
