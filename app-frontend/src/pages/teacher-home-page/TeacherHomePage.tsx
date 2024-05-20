import { TeacherAppBar } from "../../components/app-bars/TeacherAppBar";
import { CourseCards } from "../../components/CourseCards";
import { Container, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { UserType } from "../../models/User";

export const TeacherHomePage = () => {
  // const location = useLocation();

  return (
    <>
      <TeacherAppBar />
      <Container
        sx={{
          paddingLeft: "2.5%",
          paddingRight: "2.5%",
          justifyContent: "flex-start",
        }}
      >
        <h3 style={{ textAlign: "left", paddingLeft: "2.5%" }}>My courses:</h3>
        <Container
          sx={{
            flexGrow: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end", // 'flex-start'
          }}
        >
          <Link to={`/course/add`}>
            <Tooltip title="Create a course">
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                sx={{ marginBottom: "15px" }}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Link>
          <br />
        </Container>

        <CourseCards userType={UserType.Teacher} />

        <br />
      </Container>
    </>
  );
};
