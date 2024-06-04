import { Container } from "@mui/material";
import { AssignmentsCards } from "./AssignmentCards";

export const ShowAssignmentsAtCourse: React.FC<{ courseId: any }> = ({
  courseId,
}) => {
  return (
    <Container>
      <h2>Assignments</h2>
      <AssignmentsCards courseId={courseId} />
    </Container>
  );
};
