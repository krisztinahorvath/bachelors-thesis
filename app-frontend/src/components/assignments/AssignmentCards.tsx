import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  CardActionArea,
  CircularProgress,
  Container,
  Fab,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Assignment } from "../../models/Assignment";
import { getToken, getUserType } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage } from "../ToastMessage";
import { UserType } from "../../models/User";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";

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

  const navigateAddAssignment = () => {
    navigate(`/course/${courseIndex}/assignment/add`, { state: courseId });
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
              <CardActionArea>
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {card.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weight: {card.weight}%
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                  Due date:{" "}
                  {card.dueDate
                    ? new Date(card.dueDate).toLocaleString("en", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "No due date"}
                </Typography> */}
                  <Typography variant="body2" color="text.secondary">
                    Due date:{" "}
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
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Container>
      )}
    </Container>
  );
};
