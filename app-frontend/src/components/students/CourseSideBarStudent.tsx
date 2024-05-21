import { useState } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import GradingIcon from "@mui/icons-material/Grading";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import {
  getShowBadges,
  getShowLeaderboards,
} from "../../utils/student-user-preferences";
import { Paper } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

export const CourseSideBarStudent = ({
  onSelectTab,
}: {
  onSelectTab: (tabName: string) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const showLeaderboard = getShowLeaderboards();
  const showBadges = getShowBadges();

  const handleNavigateTo = (tabName: string) => {
    onSelectTab(tabName);
    setSelectedTab(tabName);
  };

  return (
    <Paper
      sx={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#d0e3fb",
        margin: "auto",
        marginLeft: "25%",
        position: "sticky",
        top: "2px",
        // paddingTop: "2.5%",
        // paddingBottom: "2.5%",
        // height: "16.3%",
        "@media (max-width: 768px)": {
          width: "100%",
        },
      }}
    >
      <MenuList>
        <MenuItem
          selected={selectedTab === "details"}
          onClick={() => handleNavigateTo("details")}
        >
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Course Details
          </Typography>
        </MenuItem>
        {/* <MenuItem
          selected={selectedTab === "students"}
          onClick={() => handleNavigateTo("students")}
        >
          <ListItemIcon>
            <SchoolIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Enrolled Students
          </Typography>
        </MenuItem> */}
        <MenuItem
          selected={selectedTab === "assignments"}
          onClick={() => handleNavigateTo("assignments")}
        >
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Assignments
          </Typography>
        </MenuItem>
        <MenuItem
          selected={selectedTab === "grades"}
          onClick={() => handleNavigateTo("grades")}
        >
          <ListItemIcon>
            <GradingIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Grades
          </Typography>
        </MenuItem>
        {showLeaderboard === "true" && (
          <MenuItem
            selected={selectedTab === "leaderboard"}
            onClick={() => handleNavigateTo("leaderboard")}
          >
            <ListItemIcon>
              <LeaderboardIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Leaderboard
            </Typography>
          </MenuItem>
        )}
        {showBadges === "true" && (
          <MenuItem
            selected={selectedTab === "achievements"}
            onClick={() => handleNavigateTo("achievements")}
          >
            <ListItemIcon>
              <LocalPoliceIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              Achievements
            </Typography>
          </MenuItem>
        )}
      </MenuList>
    </Paper>
  );
};
