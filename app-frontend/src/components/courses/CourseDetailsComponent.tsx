import {
  Autocomplete,
  Box,
  Button,
  Container,
  Fab,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Course } from "../../models/Course";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import AddIcon from "@mui/icons-material/Add";
import { User } from "../../models/User";
import { debounce, head } from "lodash";

interface AddCourseTeachers {
  teacherIds: number[];
}

export const CourseDetailsComponent: React.FC<{ courseData: any }> = ({
  courseData,
}) => {
  const [course, setCourse] = useState<Course>(courseData);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [addCourseTeachers, setAddCourseTeachers] = useState<AddCourseTeachers>(
    {
      teacherIds: [],
    }
  );
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

  // teachers
  const fetchSuggestionsTeachers = async (query: string) => {
    if (query !== "") {
      try {
        const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
        const response = await axios.get<User[]>(
          `${BACKEND_URL}/teachers/autocomplete?courseId=${course.id}&query=${query}&pageNumber=1&pageSize=100`,
          headers
        );
        const data = await response.data;
        setTeachers(data);
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
    console.log("input", value, reason);

    if (reason === "input") {
      debouncedFetchSuggestionsTeachers(value);
    }
  };

  const addTeachersToCourse = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/books/${course.id}/teacherList/`,
        addCourseTeachers
      );
      displaySuccessMessage("Teachers added successfully to course!");
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        displayErrorMessage("You don't have permission to do this action it!");
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
          // alignItems: "center",
          marginTop: "2.5%",
          marginLeft: "4.5%",
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
        />
        <Button onClick={generateEnrollmentKey}>
          Generate new enrollment key
        </Button>
      </Container>
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end", // 'flex-start'
        }}
      >
        <Tooltip title="Add teacher to course">
          <Fab
            size="small"
            color="primary"
            aria-label="add"
            sx={{ marginBottom: "15px" }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <br />
      </Container>
      <Box>
        <h3>Teachers:</h3>
        <Autocomplete
          multiple
          id="teachers"
          sx={{ width: "45%" }}
          options={teachers}
          getOptionLabel={(option) => `${option.name} - ${option.email}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add Teachers"
              variant="outlined"
              placeholder="Teachers"
            />
          )}
          filterSelectedOptions
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onInputChange={handleInputChangeAuthors}
          onChange={(event, value) => {
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
      </Box>
    </>
  );
};
