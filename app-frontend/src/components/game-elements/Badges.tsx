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
    name: string;
    description: string;
    achievementCriteria: number;
    achieved: boolean;
  };
} = {
  1: {
    icon: <OrigamiBadge />,
    name: "Windmill Wizard",
    description:
      "Embark on an epic journey of knowledge. <br /> <em>A gift for taking your first step.</em>",
    achievementCriteria: 0,
    achieved: true,
  },
  2: {
    icon: <AirplaneBadge />,
    name: "Paper Plane Pilot",
    description: "Fold your way to success.",
    achievementCriteria: 2,
    achieved: false,
  },
  3: {
    icon: <LightbulbBadge />,
    name: "Idea Illuminator",
    description: "Brighten your path with brilliant insights!",
    achievementCriteria: 4,
    achieved: false,
  },
  4: {
    icon: <MarioMushroomBadge />,
    name: "Level-Up Legend",
    description: "Unlocked at 40XP",
    achievementCriteria: 6.5,
    achieved: false,
  },
  5: {
    icon: <AstronautBadge />,
    name: "Galactic Guru",
    description: "Rocket through learning milestones!",
    achieved: false,
    achievementCriteria: 9.5,
  },
  6: {
    icon: <OnTimeBadge />,
    name: "Deadline Dominator",
    description:
      "Tick-tock, beat the clock! <br /> <em> Unlocked after presenting 75% of assignments before the deadline.</em>",
    achieved: false,
    achievementCriteria: 0,
  },
};

const IconWithDescription: React.FC<{
  iconData: {
    icon: React.ReactElement;
    name: string;
    description: string;
    achievementCriteria: number;
    achieved: boolean;
  };
  pointsVisibility: boolean;
}> = ({ iconData, pointsVisibility }) => {
  const filterStyle = iconData.achieved
    ? "none"
    : "grayscale(100%) blur(1.5px)";

  return (
    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
      <div style={{ filter: filterStyle }}>{iconData.icon}</div>
      <Typography variant="body1">
        <strong>{iconData.name}</strong>
      </Typography>
      <Typography
        variant="body2"
        dangerouslySetInnerHTML={{ __html: iconData.description }}
      />
      {iconData.achievementCriteria > 0 && (
        <>
          {" "}
          {pointsVisibility ? (
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-line", fontStyle: "italic" }}
            >
              Unlocked at {iconData.achievementCriteria * 300}XP.
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-line", fontStyle: "italic" }}
            >
              Unlocked at {iconData.achievementCriteria} points.
            </Typography>
          )}
        </>
      )}
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
                  ? studentData.onTimeBadgeUnlocked // check specifically for the On Time Badge
                  : studentData.level >= parseInt(key);

              const iconData = {
                ...icons[key],
                achieved: achieved,
              };

              return (
                <IconWithDescription
                  key={key}
                  iconData={iconData}
                  pointsVisibility={pointsVisibility}
                />
              );
            })}
          </Grid>
        </Container>
      )}
    </>
  );
};
