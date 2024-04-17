import "./App.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login-page/LoginPage";
import { HomePage } from "./pages/home-page/HomePage";
import { StudentHomePage } from "./pages/student-home-page/StudentHomePage";
import { TeacherHomePage } from "./pages/teacher-home-page/TeacherHomePage";
import { UserType } from "./models/User";
import { PrivateRoute } from "./utils/private-route-utils";
import { RegisterPage } from "./pages/register-page/RegisterPage";
import { CoursePageTeacher } from "./pages/CoursePageTeacher";
import { AddCoursePage } from "./pages/AddCoursePage";
import { StudentUserPreferences } from "./pages/StudentUserPreferences";
import { HomeAppBar } from "./components/HomeAppBar";

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
          {/* <Route path = "/grades" element={<StudentGradesPage/>} /> */}

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
            path="/course/:courseIndex/details/*"
            element={
              <PrivateRoute
                allowedUsers={[UserType.Teacher]}
                element={<CoursePageTeacher />}
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
          {/* <Route path="/course/update" 
            element={<PrivateRoute allowedUsers={[UserType.Teacher]} element={<UpdateCoursePage/>}/>} 
          />
          <Route path="/course/delete" 
            element={<PrivateRoute allowedUsers={[UserType.Teacher]} element={<DeleteCoursePage/>}/>} 
          /> */}
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;
