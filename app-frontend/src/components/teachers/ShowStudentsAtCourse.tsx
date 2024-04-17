import { useLocation } from "react-router-dom";

interface ShowStudentsAtCourseProps {
  courseId: any; // Define the courseId prop
}

export const ShowStudentsAtCourse: React.FC<ShowStudentsAtCourseProps> = ({
  courseId,
}) => {
  const location = useLocation();
  // const courseId = location.state as any as number;
  //   const [course, setCourse] = useState<Course>({
  //     id: -1,
  //     name: "",
  //     enrollmentKey: "",
  //     image: "",
  //   });

  return <div> Students at course {courseId}</div>;
};
