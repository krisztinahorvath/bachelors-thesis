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
  TextField,
  Tooltip,
} from "@mui/material";

interface ShowStudentsAtCourseProps {
  courseId: any; // Define the courseId prop
}

export const ShowStudentsAtCourse: React.FC<ShowStudentsAtCourseProps> = ({
  courseId,
}) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

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

  return (
    <Container>
      <h2>All enrolled students</h2>

      {loading && <CircularProgress />}
      {!loading && students.length === 0 && <p>No books found</p>}
      {!loading && (
        <IconButton component={Link} sx={{ mr: 3 }} to={`/books/add`}>
          <Tooltip title="Add a new book" arrow>
            <AddIcon color="primary" />
          </Tooltip>
        </IconButton>
      )}

      {/* {!loading && (
        <Button
          variant={path.startsWith("/books/filter-year") ? "outlined" : "text"}
          to="/books/filter-year"
          component={Link}
          color="inherit"
          sx={{ mr: 5 }}
          startIcon={<ViewListIcon />}
        >
          Filter
        </Button>
      )} */}

      {/* {!loading && (
        <Button
          variant={
            path.startsWith("/books/order-by-author-age") ? "outlined" : "text"
          }
          to="/books/order-by-author-age"
          component={Link}
          color="inherit"
          sx={{ mr: 5 }}
          startIcon={<ViewListIcon />}
        >
          Books ordered by average author age
        </Button>
      )} */}

      {/* {!loading && (
				<Button
					variant={path.startsWith("/books/add-authors") ? "outlined" : "text"}
					to="/books/add-authors"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Add authors to book
				</Button> 
			)} */}

      {!loading && students.length > 0 && (
        <div>
          {students.map((student, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <TextField
                label="Name"
                variant="outlined"
                value={student.name}
                disabled
                style={{ marginRight: "8px" }}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={student.email}
                disabled
                style={{ marginRight: "8px" }}
              />
              <IconButton onClick={() => handleDelete(student.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};
