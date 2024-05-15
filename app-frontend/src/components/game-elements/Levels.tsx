import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Airplane from "../../assets/airplane.svg";
import Origami from "../../assets/origami.svg";
import Astronaut from "../../assets/astronaut.svg";
import Lightbulb from "../../assets/lightbulb.svg";
import MarioMushroom from "../../assets/mariomushroom.svg";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(78,135,192) 0%,rgb(102,204,255) 50%,rgb(55,138,138) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(78,135,192) 0%,rgb(102,204,255) 50%,rgb(55,138,138) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3, // line thickness
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
    marginLeft: 8,
    marginRight: 8,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ ownerState }) => ({
  backgroundColor: "none",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.completed && {
    boxShadow: "0 4px 20px 0 rgba(0,0,0,.50)",
    filter: "none", // Remove filter effect if completed
    opacity: 1, // Set full opacity for completed steps
  }),
  ...(ownerState.active && {
    backgroundImage: "none",
    boxShadow: "0 4px 20px 0 rgba(0,0,0,.70)",
  }),
  ...(!ownerState.completed &&
    !ownerState.active && {
      filter: "grayscale(100%)", // Apply filter effect if not active or completed
      opacity: 0.5, // Reduce opacity if not active or completed
    }),
}));

const AirplaneBadge = () => {
  return <img src={Airplane} alt="airplane" style={{ width: "120%" }} />;
};

const OrigamiBadge = () => {
  return <img src={Origami} alt="origami" style={{ width: "120%" }} />;
};

const AstronautBadge = () => {
  return <img src={Astronaut} alt="origami" style={{ width: "120%" }} />;
};

const LightbulbBadge = () => {
  return <img src={Lightbulb} alt="lightbulb" style={{ width: "120%" }} />;
};

const MarioMushroomBadge = () => {
  return <img src={MarioMushroom} alt="mushroom" style={{ width: "120%" }} />;
};

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <OrigamiBadge />, // beginner
    2: <AirplaneBadge />,
    3: <LightbulbBadge />,
    4: <MarioMushroomBadge />,
    5: <AstronautBadge />, // out of this world
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5🎉"];

export const CustomizedSteppers: React.FC<{ activeSteps: number }> = ({
  activeSteps,
}) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={3}>
      <br />
      <Stepper
        alternativeLabel
        activeStep={activeSteps}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
};
