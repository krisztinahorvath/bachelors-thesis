import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { Typography } from "@mui/material";
import classroomSVG from "../../assets/classroom.svg";
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

  const handleNavigateToStudents = () => {
    onSelectTab("students");
  };

  const handleNavigateToAssignments = () => {
    onSelectTab("assignments");
  };

  const handleNavigateToGrades = () => {
    onSelectTab("grades");
  };

  const handleNavigateToDetails = () => {
    onSelectTab("");
  };

  const handleNavigateToTeacherDashboard = () => {
    navigate("/teacher-dashboard");
  };

  const handleNavigateToLeaderboard = () => {};

  return (
    // use collapse for making it small
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "pink" }} // background.paper
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <Typography variant="h6">Course Menu</Typography>
        </ListSubheader>
      }
    >
      <ListItemButton onClick={handleNavigateToTeacherDashboard}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home Page" />
      </ListItemButton>

      <ListItemButton onClick={handleNavigateToDetails}>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary="Course Details" />
      </ListItemButton>

      <ListItemButton onClick={handleNavigateToStudents}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Enrolled Students" />
      </ListItemButton>

      <ListItemButton onClick={handleNavigateToAssignments}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Assignments" />
      </ListItemButton>

      <ListItemButton onClick={handleNavigateToGrades}>
        <ListItemIcon>
          <GradingIcon />
        </ListItemIcon>
        <ListItemText primary="Grades" />
      </ListItemButton>

      <ListItemButton onClick={handleNavigateToLeaderboard}>
        <ListItemIcon>
          <LeaderboardIcon />
        </ListItemIcon>
        <ListItemText primary="Leaderboard" />
      </ListItemButton>

      {/* <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Assignments" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse> */}
      <br />
      <div>
        <img src={classroomSVG} alt="student" style={{ width: "80%" }} />
        <div style={{ textAlign: "center" }}>Some text here</div>
      </div>
    </List>
  );
};