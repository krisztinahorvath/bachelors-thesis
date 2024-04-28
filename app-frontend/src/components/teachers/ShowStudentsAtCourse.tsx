import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Student } from "../../models/Student";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CircularProgress,
  Container,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import "../../components/responsive-table/ResponsiveTable.css";

interface ShowStudentsAtCourseProps {
  courseId: any;
}

let page = 1;
export const ShowStudentsAtCourse: React.FC<ShowStudentsAtCourseProps> = ({
  courseId,
}) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  // const pageSize = 10;
  const [noOfPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/courses/students/${courseId}`, headers)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage("An error occurred while fetching the students.");
        }
      });
  }, []);

  function handleDelete(id: number | undefined): void {
    displayErrorMessage(
      `Function not implemented, but it would delete student with id ${id}`
    );
  }

  const reloadData = () => {
    console.log(page);
    setLoading(true);
    // Promise.all([
    //   fetch(
    //     `${BACKEND_URL}/books/?pageNumber=${page - 1}&pageSize=${pageSize}`
    //   ).then((response) => response.json()),
    //   fetch(
    //     `${BACKEND_URL}/books/count-authors?pageNumber=${
    //       page - 1
    //     }&pageSize=${pageSize}`
    //   ).then((response) => response.json()),
    // ]).then(([data, count]) => {
    //   setBooks(data);
    //   setNrAuthors(count);
    //   setLoading(false);
    // });
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    page = value;
    reloadData();
  };

  return (
    <Container>
      <h2>All enrolled students</h2>

      {loading && <CircularProgress />}
      {!loading && students.length === 0 && (
        <p>No students enrolled at course.</p>
      )}

      {!loading && (
        <IconButton component={Link} sx={{ mr: 3 }} to={`/students/add`}>
          <Tooltip title="Add a new student" arrow>
            <AddIcon color="primary" />
          </Tooltip>
        </IconButton>
      )}

      {!loading && students.length > 0 && (
        <Container>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Unique Code</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span className="cell-header">#</span> {student.id}
                  </td>
                  <td>
                    <span className="cell-header">Name:</span> {student.name}
                  </td>
                  <td>
                    <span className="cell-header">Unique Code:</span>{" "}
                    {student.uniqueIdentificationCode}
                  </td>
                  <td>
                    <span className="cell-header">Email:</span> {student.email}
                  </td>
                  <td>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(student.id)}
                    >
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Container
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "100%",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={noOfPages}
                page={page}
                onChange={handlePageChange}
                size="large"
                variant="outlined"
                color="secondary"
              />
            </Stack>
          </Container>
        </Container>
      )}
    </Container>
  );
};
