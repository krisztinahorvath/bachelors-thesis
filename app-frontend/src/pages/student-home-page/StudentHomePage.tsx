import { StudentAppBar } from "../../components/app-bars/StudentAppBar";
import { Container, Fab, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CourseCards } from "../../components/courses/CourseCards";
import { UserType } from "../../models/User";
import { useEffect, useState } from "react";
import { EnrollDialog } from "../../components/EnrollDialog";

export const StudentHomePage = () => {
  const [open, setOpen] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState(false);
  const [courseCardsKey, setCourseCardsKey] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (newEnrollment) {
      // increment the key to force CourseCards component to re-render
      setCourseCardsKey((prevKey) => prevKey + 1);
      // reset newEnrollment to false
      setNewEnrollment(false);
    }
  }, [newEnrollment]);

  return (
    <>
      <StudentAppBar />
      <Container
      // sx={{
      //   paddingLeft: "2.5%",
      //   paddingRight: "2.5%",
      //   justifyContent: "flex-start",
      // }}
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
          <br />
          {open && (
            <EnrollDialog
              open={open}
              handleClose={handleClose}
              onNewEnrollment={() => setNewEnrollment(true)}
            />
          )}
        </Container>

        <CourseCards key={courseCardsKey} userType={UserType.Student} />

        <br />
      </Container>
    </>
  );
};
