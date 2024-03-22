import './App.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage} from './pages/login-page/LoginPage';
import { HomePage } from './pages/home-page/HomePage';
import { StudentHomePage } from './pages/student-home-page/StudentHomePage';
import { TeacherHomePage } from './pages/teacher-home-page/TeacherHomePage';

function App() {
  return (
    <React.Fragment>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
    />

      <Router>
        <Routes>
          <Route path="/" element={< HomePage />} />
          <Route path = "/login" element={<LoginPage />} />
          <Route path="/student-dashboard" element={<StudentHomePage/>}/>
          <Route path="/teacher-dashboard" element={<TeacherHomePage/>}/>
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
