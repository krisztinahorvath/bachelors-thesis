import { StudentAppBar } from "../../components/students/StudentAppBar";
import { Container, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CourseCards } from "../../components/CourseCards";
import { UserType } from "../../models/User";
import { useEffect, useState } from "react";
import { EnrollDialog } from "../../components/EnrollDialog";

export const StudentHomePage = () => {
  const [open, setOpen] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (newEnrollment) {
      setNewEnrollment(false);
    }
  }, [newEnrollment]);

  return (
    <Container
    // sx={{
    //   paddingLeft: "2.5%",
    //   paddingRight: "2.5%",
    //   justifyContent: "flex-start",
    // }}
    >
      <StudentAppBar />
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
        <Tooltip
          title="Enroll to course"
          onClick={() => {
            setOpen(true);
          }}
        >
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
        <br />
        {open && (
          <EnrollDialog
            key={newEnrollment ? "enroll" : "normal"}
            open={open}
            handleClose={handleClose}
            onNewEnrollment={() => setNewEnrollment(true)}
          />
        )}
      </Container>

      <CourseCards userType={UserType.Student} />

      <br />
    </Container>
  );
};
