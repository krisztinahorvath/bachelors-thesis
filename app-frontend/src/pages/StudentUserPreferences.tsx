import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import InsightsIcon from "@mui/icons-material/Insights";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import StairsIcon from "@mui/icons-material/Stairs";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import GrainIcon from "@mui/icons-material/Grain";
import { Button, Container } from "@mui/material";
import { StudentAppBar } from "../components/students/StudentAppBar";
import { useEffect } from "react";
import {
  getShowBadges,
  getShowLeaderboards,
  getShowLevels,
  getShowPoints,
  getShowProgressBars,
} from "../utils/student-user-preferences";

const submitButtonStyle = {
  backgroundColor: "#84B1F2",
  color: "white",
  borderRadius: "10px",
  // border: 'none',
  boxShadow: "0 0 10px #84B1F2",
  padding: "3%", // width
  marginTop: "10%",
  marginBottom: "5%",
};

export const StudentUserPreferences = () => {
  const [checked, setChecked] = React.useState([""]);

  useEffect(() => {
    const newChecked: string[] = [];
    if (getShowPoints() === "true") newChecked.push("points");
    if (getShowLevels() === "true") newChecked.push("levels");
    if (getShowBadges() === "true") newChecked.push("badges");
    if (getShowProgressBars() === "true") newChecked.push("progressbars");
    if (getShowLeaderboards() === "true") newChecked.push("leaderboards");

    setChecked(newChecked);
  }, []);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // ***************************************
  //maybe add a picture in this page of a console and lay over the console the list with the toggles
  // to make it more interesting
  // ***************************************

  return (
    <Container>
      <StudentAppBar />
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          // paddingTop: "0.5%",
          bgcolor: "background.paper",
          margin: "auto",
          // display: "flex",
          // flexDirection: "column",
          // alognItem: "center",
          // justifyContent: "center",
        }}
        subheader={
          <ListSubheader sx={{ fontSize: "1.3rem" }}>
            Page Settings
          </ListSubheader>
        }
      >
        <ListItem>
          <ListItemIcon>
            <GrainIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-points" primary="Points" />
          <Switch
            edge="end"
            onChange={handleToggle("points")}
            checked={checked.indexOf("points") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-points",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <StairsIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-wifi" primary="Levels" />
          <Switch
            edge="end"
            onChange={handleToggle("levels")}
            checked={checked.indexOf("levels") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-wifi",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LocalPoliceIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Badges" />
          <Switch
            edge="end"
            onChange={handleToggle("badges")}
            checked={checked.indexOf("badges") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-bluetooth",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="Progress Bars"
          />
          <Switch
            edge="end"
            onChange={handleToggle("progressbars")}
            checked={checked.indexOf("progressbars") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-bluetooth",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LeaderboardIcon />
          </ListItemIcon>
          <ListItemText
            id="switch-list-label-bluetooth"
            primary="Leaderboards"
          />
          <Switch
            edge="end"
            onChange={handleToggle("leaderboards")}
            checked={checked.indexOf("leaderboards") !== -1}
            inputProps={{
              "aria-labelledby": "switch-list-label-bluetooth",
            }}
          />
        </ListItem>
        <Button type="submit" style={submitButtonStyle}>
          Save page preferences
        </Button>
      </List>
      <p>
        <b>Note:</b> You can change the settings of the page as many times as
        you like without any restrictions. <br /> We encourage you to try out
        each gamification element and find out what suits you most! 😊
      </p>
    </Container>
  );
};
