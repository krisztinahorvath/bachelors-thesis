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

export const StudentUserPreferences = () => {
  const [checked, setChecked] = React.useState(["wifi"]);

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

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      subheader={<ListSubheader>Page Settings</ListSubheader>}
    >
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
        <ListItemText id="switch-list-label-bluetooth" primary="Progress Bar" />
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
          primary="Leader boards"
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
    </List>
  );
};
