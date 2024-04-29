import { Container } from "@mui/material";
import { AssignmentsCards } from "./AssignmentCards";

interface ShowAssignmentsAtCourseProps {
  courseId: any; // Define the courseId prop
}

export const ShowAssignmentsAtCourse: React.FC<
  ShowAssignmentsAtCourseProps
> = ({ courseId }) => {
  // const courseId = location.state as any as number;
  //   const [course, setCourse] = useState<Course>({
  //     id: -1,
  //     name: "",
  //     enrollmentKey: "",
  //     image: "",
  //   });

  return (
    <Container>
      <h2>Assignmets at course {courseId}</h2>
      <AssignmentsCards courseId={courseId} />
    </Container>
  );
};
