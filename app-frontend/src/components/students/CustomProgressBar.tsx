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
    const backgroundColor =
      theme.palette.mode === "light"
        ? theme.palette.grey[450 as keyof Color]
        : theme.palette.grey[800 as keyof Color];

    return {
      height: 25,
      borderRadius: 15,
      [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: backgroundColor,
      },
      [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 15,
        backgroundColor: theme.palette.mode === "light" ? "#2D76D2" : "#308fe8",
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
