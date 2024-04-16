import { useLocation } from "react-router-dom";

export const CourseDetailsForTeacher = () => {
    const location = useLocation();
    const courseId = location.state;
    return (
        <h1> Course with id {courseId} </h1>
    );
};