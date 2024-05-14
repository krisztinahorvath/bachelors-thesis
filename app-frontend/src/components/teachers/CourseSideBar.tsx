import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import GradingIcon from "@mui/icons-material/Grading";

export const CourseSideBar = ({
  onSelectTab,
}: {
  onSelectTab: (tabName: string) => void;
}) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("");

  const handleNavigateToTeacherDashboard = () => {
    navigate("/teacher-dashboard");
    setSelectedTab("");
  };

  const handleNavigateTo = (tabName: string) => {
    onSelectTab(tabName);
    setSelectedTab(tabName);
  };

  return (
    // use collapse for making it small
    <List
      sx={{
        maxWidth: "16%",
        position: "absolute",
        backgroundColor: "#d0e3fb",
        height: "45%",
        overflowY: "auto",
        borderRadius: "8px",
        padding: "5px",
        marginLeft: "5px",
        marginRight: "5px",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton
        selected={selectedTab === ""}
        onClick={handleNavigateToTeacherDashboard}
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home Page" />
      </ListItemButton>

      <ListItemButton
        selected={selectedTab === "details"}
        onClick={() => handleNavigateTo("details")}
      >
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="Course Details" />
      </ListItemButton>

      <ListItemButton
        selected={selectedTab === "students"}
        onClick={() => handleNavigateTo("students")}
      >
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Enrolled Students" />
      </ListItemButton>

      <ListItemButton
        selected={selectedTab === "assignments"}
        onClick={() => handleNavigateTo("assignments")}
      >
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Assignments" />
      </ListItemButton>

      <ListItemButton
        selected={selectedTab === "grades"}
        onClick={() => handleNavigateTo("grades")}
      >
        <ListItemIcon>
          <GradingIcon />
        </ListItemIcon>
        <ListItemText primary="Grades" />
      </ListItemButton>
    </List>
  );
};
