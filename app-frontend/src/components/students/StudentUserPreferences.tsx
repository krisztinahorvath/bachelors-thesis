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
import { StudentAppBar } from "../app-bars/StudentAppBar";
import { useEffect } from "react";
import {
  getShowBadges,
  getShowLeaderboards,
  getShowLevels,
  getShowPoints,
  getShowProgressBars,
  setStudentUserPreferences,
} from "../../utils/student-user-preferences";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";

const submitButtonStyle = {
  backgroundColor: "#84B1F2",
  color: "white",
  borderRadius: "10px",
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

  const handleSave = async () => {
    try {
      let showPoints: boolean = false;
      let showLevels: boolean = false;
      let showBadges: boolean = false;
      let showProgressBars: boolean = false;
      let showLeaderboards: boolean = false;

      if (checked.indexOf("points") !== -1) showPoints = true;
      if (checked.indexOf("levels") !== -1) showLevels = true;
      if (checked.indexOf("badges") !== -1) showBadges = true;
      if (checked.indexOf("progressbars") !== -1) showProgressBars = true;
      if (checked.indexOf("leaderboards") !== -1) showLeaderboards = true;

      const studentUserPreferenceDTO = {
        showPoints,
        showLevels,
        showBadges,
        showProgressBars,
        showLeaderboards,
      };

      const headers = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };

      const response = await axios.put(
        `${BACKEND_URL}/students/user-preferences`,
        studentUserPreferenceDTO,
        headers
      );

      if (response.status === 204) {
        displaySuccessMessage("Preferences updated successfully!");

        // set the user preferences
        setStudentUserPreferences(studentUserPreferenceDTO);
      } else {
        displayErrorMessage("An error occured in updating the preferences.");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(`Updating preferences failed. ${errorMessage}`);
      } else {
        console.log(error);
        displayErrorMessage(
          "An error occurred while trying to update preferences."
        );
      }
    }
  };

  return (
    <>
      <StudentAppBar />
      <Container>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            margin: "auto",
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
            <ListItemText
              id="switch-list-label-points"
              primary="Experience Points"
            />
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
          <Button onClick={handleSave} style={submitButtonStyle}>
            Save page preferences
          </Button>
        </List>
        <p>
          <b>Note:</b> You can change the settings of the page as many times as
          you like without any restrictions. <br /> We encourage you to try out
          each gamification element and find out which suit you most! 😊
        </p>
      </Container>
    </>
  );
};
