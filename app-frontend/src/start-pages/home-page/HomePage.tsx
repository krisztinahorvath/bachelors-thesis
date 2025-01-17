import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import {
  divStyle,
  imageStyle,
  textContainerStyle,
  typographyStyle2,
  typographyStyle3,
} from "./HomePageStyle";
import { getUserType } from "../../utils/auth-utils";
import { HomeAppBar } from "../../components/app-bars/HomeAppBar";
import "./styles.css";

export const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userTypeLocalStorage = getUserType();

    if (userTypeLocalStorage === "0") navigate("teacher-dashboard");
    else if (userTypeLocalStorage === "1") {
      navigate("student-dashboard");
    }
  }, []);

  return (
    <React.Fragment>
      <HomeAppBar />

      <Container>
        <Container maxWidth="md" sx={textContainerStyle}>
          <Typography variant="h4" gutterBottom sx={typographyStyle2}>
            Welcome to Online Grades Register!
          </Typography>
          <Typography variant="body1" sx={typographyStyle3}>
            This is a grades register made more fun and engaging for students.
          </Typography>
        </Container>

        <div style={divStyle}>
          <a
            href="https://www.vecteezy.com/free-vector/online-learning"
            target="_blank"
          >
            <img
              src="/homePage.jpg"
              alt="Online Learning Vectors by Vecteezy"
              style={imageStyle}
              className="responsive-image"
            />
          </a>
        </div>
      </Container>
    </React.Fragment>
  );
};
