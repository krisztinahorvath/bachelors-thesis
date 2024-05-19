import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Box,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Assignment } from "../../models/Assignment";
import { getToken, getUserType } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { UserType } from "../../models/User";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface ShowAssignmentsAtCourseProps {
  courseId: any;
}

export const AssignmentsCards: React.FC<ShowAssignmentsAtCourseProps> = ({
  courseId,
}) => {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [userType, setUserType] = useState<UserType>();
  const navigate = useNavigate();
  const { courseIndex } = useParams();
  const [open, setOpen] = useState(false);
  const [currentAssignment, setCurrentAssignmnet] = useState<Assignment>();

  useEffect(() => {
    setLoading(true);
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") setUserType(UserType.Teacher);
    else if (userTypeLocalStorage === "1") {
      setUserType(UserType.Student);
    }

    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/assignments/course/${courseId}`, headers)
      .then((response) => {
        setAssignments(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage(
            "An error occurred while fetching the assignments."
          );
        }
      });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const navigateAddAssignment = () => {
    navigate(`/course/${courseIndex}/assignment/add`, { state: courseId });
  };

  const handleDelete = async () => {
    setOpen(false);
    try {
      const authToken = getToken();
      await axios.delete(
        `${BACKEND_URL}/assignments/${currentAssignment?.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // update assignment state to reflect changes
      setAssignments((prevAssignments) =>
        prevAssignments.filter(
          (assignment) => assignment.id !== currentAssignment?.id
        )
      );

      displaySuccessMessage("Assignment removed successfully!");
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        displayErrorMessage(error.response.data);
      }
    }
  };

  return (
    <Container>
      {loading && <CircularProgress />}
      {!loading && userType === UserType.Teacher && (
        <>
          <Container
            sx={{
              flexGrow: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end", // 'flex-start'
            }}
          >
            <Tooltip title="Create an assignment">
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                sx={{ marginBottom: "10px" }}
                onClick={navigateAddAssignment}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
            <br />
          </Container>
        </>
      )}
      {!loading && assignments.length === 0 && (
        <p>No assignments to display.</p>
      )}

      {!loading && assignments.length > 0 && (
        <Container>
          {assignments.map((card, index) => (
            <Card key={index} sx={{ marginBottom: 2 }}>
              {/* <CardActionArea> */}
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {card.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Weight: </strong>
                    {card.weight}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Due date: </strong>
                    {card.dueDate
                      ? `${new Date(card.dueDate)
                          .getDate()
                          .toString()
                          .padStart(2, "0")}/${(
                          new Date(card.dueDate).getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}/${new Date(
                          card.dueDate
                        ).getFullYear()} ${new Date(card.dueDate)
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${new Date(card.dueDate)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`
                      : "No due date"}
                  </Typography>
                </div>

                {userType === UserType.Teacher && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      paddingRight: 1,
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title="Update">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          navigate(
                            `/course/${courseIndex}/assignment/${
                              index + 1
                            }/update`,
                            {
                              state: card.id,
                            }
                          );
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setCurrentAssignmnet(card);
                          setOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </CardContent>
              {/* </CardActionArea> */}
            </Card>
          ))}
        </Container>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remove assignment</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove {currentAssignment?.name} from this
            course? All its grades will be also removed.
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
  );
};
