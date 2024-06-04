import { useState } from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import GradingIcon from "@mui/icons-material/Grading";
import { Paper } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export const CourseSideBar = ({
  onSelectTab,
}: {
  onSelectTab: (tabName: string) => void;
}) => {
  const [selectedTab, setSelectedTab] = useState("");

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
        <MenuItem
          selected={selectedTab === "students"}
          onClick={() => handleNavigateTo("students")}
        >
          <ListItemIcon>
            <SchoolIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit" noWrap>
            Enrolled Students
          </Typography>
        </MenuItem>
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
      </MenuList>
    </Paper>
  );
};
