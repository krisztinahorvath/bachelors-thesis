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
import { useLocation, useNavigate } from "react-router-dom";
import { StudentAppBar } from "../app-bars/StudentAppBar";
import { useEffect, useState } from "react";
import { getNickname, getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";
import Number1 from "../../assets/nr1.svg";
import Number2 from "../../assets/nr2.svg";
import Number3 from "../../assets/nr3.svg";
import Airplane from "../../assets/airplane.svg";
import Origami from "../../assets/origami.svg";
import Astronaut from "../../assets/astronaut.svg";
import Lightbulb from "../../assets/lightbulb.svg";
import MarioMushroom from "../../assets/mariomushroom.svg";
import Clock from "../../assets/clock.svg";
import {
  getShowBadges,
  getShowLeaderboards,
  getShowLevels,
  getShowPoints,
} from "../../utils/student-user-preferences";

interface LeaderboardDTO {
  image?: string;
  nickname: string;
  finalGrade: number;
  experiencePoints: number;
  rank?: number;
  level: number;
}

const AirplaneBadge = () => {
  return <img src={Airplane} alt="airplane" style={{ width: "60px" }} />;
};

const OrigamiBadge = () => {
  return <img src={Origami} alt="origami" style={{ width: "60px" }} />;
};

const AstronautBadge = () => {
  return <img src={Astronaut} alt="origami" style={{ width: "60px" }} />;
};

const LightbulbBadge = () => {
  return <img src={Lightbulb} alt="lightbulb" style={{ width: "60px" }} />;
};

const MarioMushroomBadge = () => {
  return <img src={MarioMushroom} alt="mushroom" style={{ width: "60px" }} />;
};

const OnTimeBadge = () => {
  return <img src={Clock} alt="on time" style={{ width: "60px" }} />;
};

const icons: {
  [index: string]: {
    icon: React.ReactElement;
  };
} = {
  1: {
    icon: <OrigamiBadge />,
  },
  2: {
    icon: <AirplaneBadge />,
  },
  3: {
    icon: <LightbulbBadge />,
  },
  4: {
    icon: <MarioMushroomBadge />,
  },
  5: {
    icon: <AstronautBadge />,
  },
  6: {
    icon: <OnTimeBadge />,
  },
};

const Number1Badge = () => {
  return <img src={Number1} alt="airplane" style={{ width: "45px" }} />;
};

const Number2Badge = () => {
  return <img src={Number2} alt="airplane" style={{ width: "40px" }} />;
};

const Number3Badge = () => {
  return <img src={Number3} alt="airplane" style={{ width: "40px" }} />;
};

const renderIconsForLevel = (level: number) => {
  return (
    <Box sx={{ paddingLeft: "10PX", display: "flex", flexWrap: "wrap" }}>
      {Object.entries(icons)
        .filter(([index]) => parseInt(index) <= level)
        .map(([index, { icon }]) => (
          <Box key={index} sx={{ padding: 1, minWidth: "60px" }}>
            {icon}
          </Box>
        ))}
    </Box>
  );
};

export const Leaderboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state;
  const currStudNickname = getNickname();
  const [pointsVisibility, setPointsVisibility] = useState(false);
  const [, setLeaderboardVisibility] = useState(false);
  const [levelsVisibility, setLevelsVisibility] = useState(false);
  const [badgesVisibility, setBadgesVisibility] = useState(false);

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<LeaderboardDTO[]>([]);

  useEffect(() => {
    setLoading(true);

    if (getShowLeaderboards() === "true") setLeaderboardVisibility(true);
    else navigate("/");
    if (getShowPoints() === "true") setPointsVisibility(true);
    if (getShowLevels() === "true") setLevelsVisibility(true);
    if (getShowBadges() === "true") setBadgesVisibility(true);

    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };

    axios
      .get(
        `${BACKEND_URL}/students/leaderboard/${courseData.courseId}`,
        headers
      )
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
    <>
      <StudentAppBar />
      <Container>
        {loading && <CircularProgress />}
        {!loading && students.length === 0 && (
          <p>No students to display for the leaderboard.</p>
        )}

        {!loading && students.length > 0 && (
          <Container
            sx={{
              width: "80%",
              "@media (max-width: 768px)": {
                width: "100%",
              },
            }}
          >
            <h2> Leaderboard for {courseData.courseName}:</h2>
            {students.map((student, index) => (
              <Card
                key={index}
                sx={{
                  marginBottom: 2,
                  backgroundColor:
                    student.nickname === currStudNickname ? "#e8f4f8" : "white", // Conditionally set the background color
                  // "@media (min-width: 768px)": {
                  //   minWidth: "110%", // set minWidth to 70% for screens wider than 768px
                  //   width: "unset", // unset width to allow minWidth to take effect
                  // },
                }}
              >
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
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      // sx={{ width: "100%" }}
                    >
                      <Avatar
                        sx={{ width: 40, height: 40 }}
                        src={`data:image/jpg;base64,${student.image}`}
                      />
                      <Box sx={{ width: "125px" }}>
                        <Typography
                          gutterBottom
                          component="div"
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            "@media (max-width: 768px)": {
                              wordBreak: "break-word",
                            },
                          }}
                        >
                          {student.nickname === currStudNickname
                            ? `${student.nickname} (You)`
                            : student.nickname}
                          {/* {student.nickname} */}
                        </Typography>
                        {pointsVisibility ? (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Points:</strong> {student.experiencePoints}{" "}
                            XP
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Final grade:</strong> {student.finalGrade}
                          </Typography>
                        )}
                        {levelsVisibility && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Level:</strong> {student.level}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {badgesVisibility && renderIconsForLevel(student.level)}
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Container>
        )}
      </Container>
    </>
  );
};
