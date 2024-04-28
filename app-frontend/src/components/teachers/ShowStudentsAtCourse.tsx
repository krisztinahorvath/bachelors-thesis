import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Student } from "../../models/Student";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  CircularProgress,
  Container,
  IconButton,
  Pagination,
  Paper,
  Stack,
  TableContainer,
  Tooltip,
} from "@mui/material";

interface ShowStudentsAtCourseProps {
  courseId: any; // Define the courseId prop
}

let page = 1;
export const ShowStudentsAtCourse: React.FC<ShowStudentsAtCourseProps> = ({
  courseId,
}) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  // const pageSize = 10;
  const [noOfPages, setNoOfPages] = useState(0);

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
    event: React.ChangeEvent<unknown>,
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
          <TableContainer component={Paper}>
            <Table>
              <Thead>
                <Tr style={{ backgroundColor: "#f5f5f5" }}>
                  <Th align="center">#</Th>
                  <Th align="center">Name</Th>
                  <Th align="center">Unique Code</Th>
                  <Th align="center">Email</Th>
                  <Th align="center">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.map((student, index) => (
                  <Tr key={(page - 1) * 10 + index + 1}>
                    <Td>{(page - 1) * 10 + index + 1}</Td>
                    <Td>
                      <Link
                        to={`/books/${student.id}/details`}
                        title="View student profile"
                      >
                        {student.name}
                      </Link>
                    </Td>
                    <Td align="right">{student.uniqueIdentificationCode}</Td>
                    <Td align="right">{student.email}</Td>
                    <Td align="right">
                      <IconButton onClick={() => handleDelete(student.id)}>
                        <DeleteIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

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
