import { TeacherAppBar } from "../../components/teachers/TeacherAppBar";
import { CourseCards } from "../../components/CourseCards";
import { Container, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { UserType } from "../../models/User";

export const TeacherHomePage = () => {
  // const location = useLocation();

  return (
    <Container
      sx={{
        paddingLeft: "2.5%",
        paddingRight: "2.5%",
        justifyContent: "flex-start",
      }}
    >
      <TeacherAppBar />
      {/* <MyCard/> */}
      <h3 style={{ textAlign: "left", paddingLeft: "2.5%" }}>My courses:</h3>
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end", // 'flex-start'
        }}
      >
        {/* <Routes>
          <Route path={`${location}/course/add`}>
            <AddCoursePage/>
          </Route>
        </Routes> */}
        <Link to={`/course/add`}>
          <Tooltip title="Create a course">
            <Fab
              size="small"
              color="primary"
              aria-label="add"
              sx={{ marginBottom: "10px" }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
          {/* <IconButton size="large">
            <AddIcon color="primary" fontSize="inherit" />
          </IconButton> */}
        </Link>
        <br />
      </Container>

      <CourseCards userType={UserType.Teacher} />

      <br />
    </Container>
  );
};
