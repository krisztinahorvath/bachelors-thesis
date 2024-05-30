import React, { useEffect, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Airplane from "../../assets/airplane.svg";
import Origami from "../../assets/origami.svg";
import Astronaut from "../../assets/astronaut.svg";
import Lightbulb from "../../assets/lightbulb.svg";
import MarioMushroom from "../../assets/mariomushroom.svg";
import Clock from "../../assets/clock.svg";
import { getShowPoints } from "../../utils/student-user-preferences";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";

const AirplaneBadge = () => {
  return <img src={Airplane} alt="airplane" style={{ width: "35%" }} />;
};

const OrigamiBadge = () => {
  return <img src={Origami} alt="origami" style={{ width: "35%" }} />;
};

const AstronautBadge = () => {
  return <img src={Astronaut} alt="origami" style={{ width: "35%" }} />;
};

const LightbulbBadge = () => {
  return <img src={Lightbulb} alt="lightbulb" style={{ width: "35%" }} />;
};

const MarioMushroomBadge = () => {
  return <img src={MarioMushroom} alt="mushroom" style={{ width: "35%" }} />;
};

const OnTimeBadge = () => {
  return <img src={Clock} alt="on time" style={{ width: "35%" }} />;
};

const icons: {
  [index: string]: {
    icon: React.ReactElement;
    description: string;
    achievementCriteria: string;
    achieved: boolean;
  };
} = {
  1: {
    icon: <OrigamiBadge />,
    description: "Beginner",
    achievementCriteria: "Unlocked at 0XP",
    achieved: true,
  },
  2: {
    icon: <AirplaneBadge />,
    description: "Intermediate",
    achievementCriteria: "Unlocked at 600XP",
    achieved: false,
  },
  3: {
    icon: <LightbulbBadge />,
    description: "Advanced",
    achievementCriteria: "Unlocked at 30XP",
    achieved: false,
  },
  4: {
    icon: <MarioMushroomBadge />,
    description: "Expert",
    achievementCriteria: "Unlocked at 40XP",
    achieved: false,
  },
  5: {
    icon: <AstronautBadge />,
    description: "Out of this world",
    achievementCriteria: "Unlocked at 50XP",
    achieved: false,
  },
  6: {
    icon: <OnTimeBadge />,
    description: "Always on time",
    achievementCriteria:
      "Unlocked after turning in 75% of assignments before the deadline.",
    achieved: false,
  },
};

const IconWithDescription: React.FC<{
  iconData: {
    icon: React.ReactElement;
    description: string;
    achievementCriteria: string;
    achieved: boolean;
  };
}> = ({ iconData }) => {
  const filterStyle = iconData.achieved
    ? "none"
    : "grayscale(100%) blur(1.5px)";

  return (
    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
      <div style={{ filter: filterStyle }}>{iconData.icon}</div>
      <Typography variant="body1">{iconData.description}</Typography>
      <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
        {iconData.achievementCriteria}
      </Typography>
    </Grid>
  );
};

export const StudentAchievements: React.FC<{ courseData: any }> = ({
  courseData,
}) => {
  const [loading, setLoading] = useState(false);
  const [pointsVisibility, setPointsVisibility] = useState(false);
  const [studentData, setStudentData] = useState({
    studentId: 0,
    finalGrade: 0,
    experiencePoints: 0,
    onTimeBadgeUnlocked: false,
    level: 0,
  });

  useEffect(() => {
    setLoading(true);
    if (getShowPoints() === "true") setPointsVisibility(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/students/achievements/${courseData.id}`, headers)
      .then((response) => {
        setStudentData(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
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
      <h2>Achievements at {courseData.name}</h2>
      {!loading && (
        <Container sx={{ marginTop: "5%" }}>
          <Grid container spacing={3}>
            {Object.keys(icons).map((key) => {
              const achieved =
                key === "6"
                  ? studentData.onTimeBadgeUnlocked // Check specifically for the On Time Badge
                  : studentData.level >= parseInt(key);

              const iconData = {
                ...icons[key],
                achieved: achieved,
              };

              return <IconWithDescription key={key} iconData={iconData} />;
            })}
          </Grid>
        </Container>
      )}
    </>
  );
};
