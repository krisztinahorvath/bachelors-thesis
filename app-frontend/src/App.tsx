import './App.css'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage} from './pages/login-page/LoginPage';
import { HomePage } from './pages/home-page/HomePage';

function App() {
  return (
    <React.Fragment>
      <ToastContainer/> 
      <Router>
        <Routes>
          <Route path="/" element={< HomePage />} />
          <Route path = "/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
