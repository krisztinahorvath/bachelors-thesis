import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Student } from "../../models/Student";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
// import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
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
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState(0);
  const [studentName, setStudentName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleDelete = async () => {
    setOpen(false);
    try {
      const authToken = getToken();
      await axios.delete(
        `${BACKEND_URL}/courses/unenroll/${courseId}/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // update student state to reflect changes
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== studentId)
      );

      displaySuccessMessage("Student removed successfully!");
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        displayErrorMessage(error.response.data);
      }
    }
  };

  const handleClickDelete = (studentId: number, studentName: string) => {
    setStudentId(studentId);
    setStudentName(studentName);
    setOpen(true);
  };

  return (
    <Container>
      <h2>All enrolled students</h2>

      {loading && <CircularProgress />}
      {!loading && students.length === 0 && (
        <p>No students enrolled at course.</p>
      )}

      {/* {!loading && (
        <IconButton component={Link} sx={{ mr: 3 }} to={`/students/add`}>
          <Tooltip title="Add a new student" arrow>
            <AddIcon color="primary" />
          </Tooltip>
        </IconButton>
      )} */}

      {!loading && students.length > 0 && (
        <Container sx={{ marginLeft: "2.5%" }}>
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
              {students.map((student, index) => (
                <tr key={(page - 1) * 10 + index + 1}>
                  <td>
                    <span className="cell-header">#</span>{" "}
                    {(page - 1) * 10 + index + 1}
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
                      onClick={() =>
                        handleClickDelete(student.id!, student.name!)
                      }
                    >
                      <Tooltip title="Remove student from course" arrow>
                        <DeleteIcon sx={{ color: "red" }} />
                      </Tooltip>
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <DeleteDialog
               serverUrl={`courses/unenroll/${courseId}/${studentId}`}
               title="Remove student from course"
               description={`Are you sure you want to remove ${studentName} from this course? All their course related data will be deleted.`}
            /> */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Remove student from course
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to remove {studentName} from this course?
                All their course related data will be deleted.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Cancel
              </Button>
              <Button onClick={handleDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </Container>
  );
};
