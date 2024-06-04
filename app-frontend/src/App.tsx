import "./App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./start-pages/login-page/LoginPage";
import { HomePage } from "./start-pages/home-page/HomePage";
import { StudentHomePage } from "./components/students/StudentHomePage";
import { TeacherHomePage } from "./components/teachers/TeacherHomePage";
import { UserType } from "./models/User";
import { PrivateRoute } from "./utils/private-route-utils";
import { RegisterPage } from "./start-pages/register-page/RegisterPage";
import { CoursePage } from "./components/courses/CoursePage";
import { AddCoursePage } from "./components/courses/AddCoursePage";
import { StudentUserPreferences } from "./components/students/StudentUserPreferences";
import { UserProfile } from "./components/users/UserProfile";
import { EditUserProfile } from "./components/users/EditUserProfile";
import { AddAssignment } from "./components/assignments/AddAssignment";
import { UpdateAssignment } from "./components/assignments/UpdateAssignment";
import { UpdatePassword } from "./components/users/UpdatePassword";
import { UpdateCourse } from "./components/courses/UpdateCourse";

function App() {
  return (
    <React.Fragment>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/my-profile"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Student, UserType.Teacher]}
                element={<UserProfile />}
              />
            }
          />

          <Route
            path="/edit-profile"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Student, UserType.Teacher]}
                element={<EditUserProfile />}
              />
            }
          />

          <Route
            path="/change-password"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Student, UserType.Teacher]}
                element={<UpdatePassword />}
              />
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Student]}
                element={<StudentHomePage />}
              />
            }
          />

          <Route
            path="/course/:courseIndex/update"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher]}
                element={<UpdateCourse />}
              />
            }
          />

          {/* gamification */}
          <Route
            path="/student-preferences"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Student]}
                element={<StudentUserPreferences />}
              />
            }
          />

          {/* Teacher routes */}
          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher]}
                element={<TeacherHomePage />}
              />
            }
          />
          <Route
            path="/course/:courseIndex/assignment/add"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher]}
                element={<AddAssignment />}
              />
            }
          />
          <Route
            path="/course/:courseIndex/assignment/:assignmentIndex/update"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher]}
                element={<UpdateAssignment />}
              />
            }
          />
          <Route
            path="/course/:courseIndex/details/*"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher, UserType.Student]}
                element={<CoursePage />}
              />
            }
          />
          <Route
            path="/course/add"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher]}
                element={<AddCoursePage />}
              />
            }
          />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
