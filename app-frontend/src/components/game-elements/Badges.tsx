import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Airplane from "../../assets/airplane.svg";
import Origami from "../../assets/origami.svg";
import Astronaut from "../../assets/astronaut.svg";
import Lightbulb from "../../assets/lightbulb.svg";
import MarioMushroom from "../../assets/mariomushroom.svg";
import Genius from "../../assets/genius.svg";
import EarlyBird from "../../assets/earlybird.svg";
import Clock from "../../assets/clock.svg";

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

const GeniusBadge = () => {
  return <img src={Genius} alt="genius" style={{ width: "35%" }} />;
};

const EarlyBirdBadge = () => {
  return <img src={EarlyBird} alt="early bird" style={{ width: "35%" }} />;
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
    achieved: true,
  },
  3: {
    icon: <LightbulbBadge />,
    description: "Advanced",
    achievementCriteria: "Unlocked at 30XP",
    achieved: true,
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
    icon: <GeniusBadge />,
    description: "Genius",
    achievementCriteria:
      "Unlocked at reaching 100% of the\n available grade idk change this.",
    achieved: false,
  },
  7: {
    icon: <EarlyBirdBadge />,
    description: "Early bird",
    achievementCriteria:
      "Badge unlocked after turning in x% of assignments 2 weeks before the deadline.",
    achieved: false,
  },
  8: {
    icon: <OnTimeBadge />,
    description: "Always on time",
    achievementCriteria:
      "Badge unlocked after turning in x% of assignments 2 weeks before the deadline.",
    achieved: true,
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
  const location = useLocation();
  //   const courseData = location.state;

  const [loading, setLoading] = useState(false);
  const [finalGrade, setFinalGrade] = useState(0);

  return (
    <>
      <h2>Achievements at {courseData.name}</h2>
      <Container sx={{ marginTop: "5%", marginBottom: "5%" }}>
        <Grid container spacing={3}>
          {Object.keys(icons).map((key) => (
            <IconWithDescription key={key} iconData={icons[key]} />
          ))}
        </Grid>
      </Container>
    </>
  );
};
