import './App.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { LoginPage} from './pages/login-page/LoginPage';
import { HomePage } from './pages/home-page/HomePage';
import { StudentHomePage } from './pages/student-home-page/StudentHomePage';
import { TeacherHomePage } from './pages/teacher-home-page/TeacherHomePage';
import { UserType } from './models/User';
import { PrivateRoute } from './utils/private-route-utils';
import {RegisterPage} from './pages/register-page/RegisterPage';
// import { StudentGradesPage } from './pages/student-grades-page/StudentGradesPage';

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
          <Route path="/" element={< HomePage />} />
          <Route path = "/login" element={<LoginPage />} />
          <Route path = "/register" element={<RegisterPage />} />
          {/* <Route path = "/grades" element={<StudentGradesPage/>} /> */}
        
          <Route 
            path="/student-dashboard" 
            element={<PrivateRoute allowedUsers={[UserType.Student]} element={<StudentHomePage/>}/>} 
          />
          <Route 
            path="/teacher-dashboard" 
            element={<PrivateRoute allowedUsers={[UserType.Teacher]} element={<TeacherHomePage/>}/>} 
          />
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
