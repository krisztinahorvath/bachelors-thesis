import { Container } from "@mui/material";
import { AssignmentsCards } from "./AssignmentCards";

interface ShowAssignmentsAtCourseProps {
  courseId: any; // Define the courseId prop
}

export const ShowAssignmentsAtCourse: React.FC<
  ShowAssignmentsAtCourseProps
> = ({ courseId }) => {
  return (
    <Container>
      <h2>Assignments</h2>
      <AssignmentsCards courseId={courseId} />
    </Container>
  );
};
