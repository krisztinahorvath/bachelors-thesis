import React, { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import GradingIcon from "@mui/icons-material/Grading";
import { getShowLeaderboards } from "../../utils/student-user-preferences";
import Hidden from "@mui/material/Hidden";
import Tooltip from "@mui/material/Tooltip";

export const CourseSideBarStudent = ({
  onSelectTab,
}: {
  onSelectTab: (tabName: string) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const showLeaderboard = getShowLeaderboards();
  const navigate = useNavigate();

  const handleTabClick = (tabName: string, navigateTo: string) => {
    setSelectedTab(tabName);
    onSelectTab(tabName);
    if (navigateTo) navigate(navigateTo);
  };

  return (
    <List
      sx={{
        // width: "100%",
        maxWidth: 360,
        backgroundColor: "#d0e3fb",
        position: "fixed",
        width: "5%",
        height: "100vh",
        overflow: "auto",
        paddingLeft: "2.5%",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <Typography variant="h6">Course name</Typography>
        </ListSubheader>
      }
    >
      <Tooltip title="Home Page" placement="right">
        <ListItemButton
          selected={selectedTab === "home"}
          onClick={() => handleTabClick("home", "/student-dashboard")}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <Hidden mdDown>{/* <ListItemText primary="Home Page" /> */}</Hidden>
        </ListItemButton>
      </Tooltip>

      <Tooltip title="Course Details" placement="right">
        <ListItemButton
          selected={selectedTab === "details"}
          onClick={() => handleTabClick("details", "")}
        >
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <Hidden mdDown>
            {/* <ListItemText primary="Course Details" /> */}
          </Hidden>
        </ListItemButton>
      </Tooltip>

      <Tooltip title="Enrolled Students" placement="right">
        <ListItemButton
          selected={selectedTab === "students"}
          onClick={() => handleTabClick("students", "")}
        >
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>
          <Hidden mdDown>
            {/* <ListItemText primary="Enrolled Students" /> */}
          </Hidden>
        </ListItemButton>
      </Tooltip>

      <Tooltip title="Assignments" placement="right">
        <ListItemButton
          selected={selectedTab === "assignments"}
          onClick={() => handleTabClick("assignments", "")}
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <Hidden mdDown>{/* <ListItemText primary="Assignments" /> */}</Hidden>
        </ListItemButton>
      </Tooltip>

      <Tooltip title="Grades" placement="right">
        <ListItemButton
          selected={selectedTab === "grades"}
          onClick={() => handleTabClick("grades", "")}
        >
          <ListItemIcon>
            <GradingIcon />
          </ListItemIcon>
          <Hidden mdDown>{/* <ListItemText primary="Grades" /> */}</Hidden>
        </ListItemButton>
      </Tooltip>

      {showLeaderboard === "true" && (
        <Tooltip title="Leaderboard" placement="right">
          <ListItemButton
            selected={selectedTab === "leaderboard"}
            onClick={() => handleTabClick("leaderboard", "")}
          >
            <ListItemIcon>
              <LeaderboardIcon />
            </ListItemIcon>
            <Hidden mdDown>
              {/* <ListItemText primary="Leaderboard" /> */}
            </Hidden>
          </ListItemButton>
        </Tooltip>
      )}
    </List>
  );
};
