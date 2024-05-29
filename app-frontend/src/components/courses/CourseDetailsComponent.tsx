import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Course } from "../../models/Course";
import { getEmail, getToken, getUserType } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { debounce } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { UserType } from "../../models/User";
import { Link, useNavigate } from "react-router-dom";

interface CourseTeacherListDTO {
  teacherIds: number[];
}

interface TeacherDTO {
  id: number;
  name: string;
  email: string;
}

export const CourseDetailsComponent: React.FC<{
  courseData: any;
  courseIndex: any;
}> = ({ courseData, courseIndex }) => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>();
  const [openDeleteTeacherDialog, setOpenDeleteTeacherDialog] = useState(false);
  const [openDeleteCourseDialog, setOpenDeleteCourseDialog] = useState(false);
  const [course, setCourse] = useState<Course>(courseData);
  const [suggestedTeachers, setSuggestedTeachers] = useState<TeacherDTO[]>([]);
  const [courseTeachers, setCourseTeachers] = useState<TeacherDTO[]>([]);
  const [selectedTeacherData, setSelectedTeacherData] = useState<TeacherDTO>();
  const [automcompleteKey, setAutocompleteKey] = useState(0);
  const [addCourseTeachers, setAddCourseTeachers] =
    useState<CourseTeacherListDTO>({
      teacherIds: [],
    });
  const currentTeacherEmail = getEmail();

  const handleClose = () => {
    setOpenDeleteTeacherDialog(false);
  };

  const handleDeleteTeacher = async () => {
    setOpenDeleteTeacherDialog(false);
    try {
      const authToken = getToken();
      await axios.delete(
        `${BACKEND_URL}/teachers/remove-teacher-from-course/${course.id}/${selectedTeacherData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // update courseTeachers state to reflect changes
      setCourseTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher.id !== selectedTeacherData?.id)
      );

      displaySuccessMessage("Teacher removed successfully from this course!");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage(
          "An error occurred while trying to remove the teacher from this course."
        );
      }
    }
  };

  const handleDeleteCourse = async () => {
    setOpenDeleteCourseDialog(false);
    try {
      const authToken = getToken();
      await axios.delete(`${BACKEND_URL}/courses/${course.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      displaySuccessMessage("Course deleted successfully!");
      navigate("/teacher-dashboard");
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage(
          "An error occurred while trying to delete this course."
        );
      }
    }
  };

  const generateEnrollmentKey = () => {
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/courses/new-enrollment-key/${course.id}`, headers)
      .then((response) => {
        setCourse({ ...course, enrollmentKey: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          displayErrorMessage("An error occurred while fetching the courses.");
        }
      });
  };

  // fetch teachers at course
  const fetchCourseTeachers = async () => {
    try {
      const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
      const response = await axios.get<TeacherDTO[]>(
        `${BACKEND_URL}/courses/${course.id}/teachers`,
        headers
      );
      setCourseTeachers(response.data);
    } catch (error) {
      displayErrorMessage(`Error fetching course teachers: ${error}`);
    }
  };

  useEffect(() => {
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") setUserType(UserType.Teacher);
    else if (userTypeLocalStorage === "1") setUserType(UserType.Student);

    fetchCourseTeachers();
  }, [course.id]);

  // fetch suggestions for autocomplete
  const fetchSuggestionsTeachers = async (query: string) => {
    if (query !== "") {
      try {
        const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
        const response = await axios.get<TeacherDTO[]>(
          `${BACKEND_URL}/teachers/autocomplete?courseId=${course.id}&query=${query}&pageNumber=1&pageSize=100`,
          headers
        );
        const data = await response.data;
        setSuggestedTeachers(data);
      } catch (error) {
        displayErrorMessage(`Error fetching teacher suggestions: ${error}`);
      }
    }
  };

  const debouncedFetchSuggestionsTeachers = useCallback(
    debounce(fetchSuggestionsTeachers, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedFetchSuggestionsTeachers.cancel();
    };
  }, [debouncedFetchSuggestionsTeachers]);

  const handleInputChangeAuthors = (event: any, value: any, reason: any) => {
    console.log("input", event, value, reason);

    if (reason === "input") {
      debouncedFetchSuggestionsTeachers(value);
    }
  };

  const addTeachersToCourseInPage = (teacherIds: number[]) => {
    const newCourseTeachers = suggestedTeachers
      .filter((teacher) => teacherIds.includes(teacher.id))
      .map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
      }));

    setCourseTeachers((prevTeachers) => [
      ...prevTeachers,
      ...newCourseTeachers,
    ]);
  };

  const postTeachersToCourse = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/teachers/${course.id}/teacher-list/`,
        addCourseTeachers,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      displaySuccessMessage("Teachers added successfully to course!");

      // make the new teachers visibile on the page
      addTeachersToCourseInPage(addCourseTeachers.teacherIds);
      setAddCourseTeachers({ teacherIds: [] }); // reset the state
      setAutocompleteKey((previousKey) => previousKey + 1);
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        displayErrorMessage(
          "You don't have permission to perform this action!"
        );
      } else {
        displayErrorMessage(error.response.data);
      }
    }
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: "2.5%",
          marginLeft: "5%",
          justifyContent: "flex-start",
        }}
      >
        <TextField
          id="outlined-read-only-input"
          label="Enrollment key"
          value={course.enrollmentKey}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            minWidth: "110px",
            width: "110px",
          }}
        />
        {userType === UserType.Teacher && (
          <>
            <Button
              onClick={generateEnrollmentKey}
              sx={{ marginLeft: "2%" }}
              style={{ outline: "none" }}
            >
              Generate new enrollment key
            </Button>
            <Link to={`/course/${courseIndex}/update`} state={course}>
              <IconButton
                color="primary"
                edge="end"
                aria-label="update"
                sx={{ padding: "10px", marginLeft: "2.5%" }} //marginLeft: "10vw"
                style={{ outline: "none" }}
                // onClick={() =>
                //   navigate(`/course/${courseIndex}/details`, {
                //     state: { courseData },
                //   })
                // }
              >
                <Tooltip title="Update course" arrow>
                  <EditIcon sx={{ fontSize: "1.7rem" }} />
                </Tooltip>
              </IconButton>
            </Link>

            <IconButton
              color="error"
              edge="end"
              aria-label="delete"
              onClick={() => setOpenDeleteCourseDialog(true)}
              sx={{ padding: "10px", marginRight: "5%" }}
              style={{ outline: "none" }}
            >
              <Tooltip title="Delete course" arrow>
                <DeleteIcon sx={{ fontSize: "1.7rem" }} />
              </Tooltip>
            </IconButton>
            {/* <Button
              // component={Link}
              // to="/edit-profile"
              variant="outlined"
              sx={{ marginLeft: "2.5%", background: "#f3f3f3" }}
              style={{ outline: "none" }}
            >
              Edit
            </Button>
            <Button
              color="error"
              sx={{
                marginLeft: "2.5%",
                background: "#f3f3f3",
                marginRight: "2.5%",
              }}
              style={{ outline: "none" }}
              variant="outlined"
              // onClick={() => setOpen(true)}
            >
              Delete
            </Button> */}
          </>
        )}
      </Container>
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          marginLeft: "5%",
          marginBottom: "2.5%",
        }}
      >
        <Box>
          <h3>Teachers:</h3>
          {userType === UserType.Teacher && (
            <>
              <Autocomplete
                key={automcompleteKey}
                multiple
                id="teachers"
                sx={{ width: "100%" }}
                options={suggestedTeachers}
                getOptionLabel={(option) => `${option.name} - ${option.email}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Teachers"
                    variant="outlined"
                    placeholder="Teacher name"
                  />
                )}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onInputChange={handleInputChangeAuthors}
                onChange={(_, value) => {
                  // event instead of _
                  if (value) {
                    console.log(value);
                    const teacherIds = value.map(
                      (teacher) => teacher?.id
                    ) as number[];
                    setAddCourseTeachers({
                      ...addCourseTeachers,
                      teacherIds: teacherIds,
                    });
                  }
                }}
              />
              <Button
                onClick={postTeachersToCourse}
                style={{ outline: "none" }}
              >
                Add teachers to course
              </Button>
            </>
          )}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                {userType === UserType.Teacher && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {courseTeachers.map((teacher, index) => (
                <tr key={index + 1}>
                  <td>
                    <span className="cell-header">#</span> {index + 1}
                  </td>
                  <td>
                    <span className="cell-header">Name:</span> {teacher.name}
                  </td>
                  <td>
                    <span className="cell-header">Email:</span> {teacher.email}
                  </td>
                  <td>
                    {userType === UserType.Teacher &&
                      teacher.email === currentTeacherEmail && (
                        <IconButton
                          disabled
                          color="error"
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            setSelectedTeacherData(teacher);
                            setOpenDeleteTeacherDialog(true);
                          }}
                        >
                          <Tooltip title="Remove student from course" arrow>
                            <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      )}{" "}
                    {userType === UserType.Teacher &&
                      teacher.email !== currentTeacherEmail && (
                        <IconButton
                          color="error"
                          edge="end"
                          aria-label="delete"
                          onClick={() => {
                            setSelectedTeacherData(teacher);
                            setOpenDeleteTeacherDialog(true);
                          }}
                          style={{ outline: "none" }}
                        >
                          <Tooltip title="Remove teacher from course" arrow>
                            <DeleteIcon />
                          </Tooltip>
                        </IconButton>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Container>

      <Dialog
        open={openDeleteTeacherDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove teacher</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove teacher{" "}
            <strong>{selectedTeacherData?.name} </strong> from this course? They
            will not have access to the course's data anymore. If you wish to
            give access to them later, you can still do it from this page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDeleteTeacher} sx={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteCourseDialog}
        onClose={() => setOpenDeleteCourseDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete course</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete course{" "}
            <strong>{courseData?.name} </strong>?{" "}
            <span style={{ color: "red", display: "block" }}>
              You will lose all data, including assignments and grades, make
              sure to save anything important before deleting it.
            </span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteCourseDialog(false)} autoFocus>
            Cancel
          </Button>
          <Button onClick={handleDeleteCourse} sx={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
