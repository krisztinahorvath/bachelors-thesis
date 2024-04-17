import { useLocation } from "react-router-dom";

interface ShowAssignmentsAtCourseProps {
  courseId: any; // Define the courseId prop
}

export const ShowAssignmentsAtCourse: React.FC<
  ShowAssignmentsAtCourseProps
> = ({ courseId }) => {
  const location = useLocation();
  // const courseId = location.state as any as number;
  //   const [course, setCourse] = useState<Course>({
  //     id: -1,
  //     name: "",
  //     enrollmentKey: "",
  //     image: "",
  //   });

  return <div> Assignmets at course {courseId}</div>;
};