import * as React from "react";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Color } from "@mui/material";
import { Theme } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(
  ({ theme }: { theme: Theme }) => {
    const linearGradient = `linear-gradient(95deg, rgb(78,135,192) 0%, rgb(102,204,255) 50%, rgb(166,230,230) 100%)`;

    const backgroundColor =
      theme.palette.mode === "light"
        ? "#B7CDCD"
        : theme.palette.grey[800 as keyof Color];

    return {
      height: 25,
      borderRadius: 15,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: backgroundColor,
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 15,
        backgroundImage: linearGradient,
      },
    };
  }
);

export const CustomProgressBar: React.FC<{ value: number }> = ({ value }) => {
  return (
    <Stack spacing={2} sx={{ flexGrow: 1, position: "relative" }}>
      <BorderLinearProgress variant="determinate" value={value} />
      <Typography
        variant="body2"
        color="white"
        sx={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      >
        {`${Math.round(value)}%`}
      </Typography>
    </Stack>
  );
};
