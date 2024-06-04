import { Container } from "@mui/material";
import { AssignmentsCards } from "./AssignmentCards";

export const ShowAssignmentsAtCourse: React.FC<{
  courseId: any;
  courseName: any;
}> = ({ courseId, courseName }) => {
  return (
    <Container>
      <h2>Assignments at {courseName}</h2>
      <AssignmentsCards courseId={courseId} />
    </Container>
  );
};
