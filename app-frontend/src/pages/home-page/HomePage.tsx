import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import {
  appBarStyles,
  boxStyle,
  buttonStyle,
  divStyle,
  imageStyle,
  textContainerStyle,
  toolBarStyle,
  typographyStyle1,
  typographyStyle2,
  typographyStyle3,
} from "./HomePageStyle";

const pages = ["About us", "Log In", "Register"];
export const HomePage = () => {
  // const theme = useTheme();
  // const location = useLocation();
  // const path = location.pathname;

  return (
    <React.Fragment>
      <AppBar sx={appBarStyles}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={toolBarStyle}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={typographyStyle1}
            >
              Online grades register
            </Typography>

            <Box sx={boxStyle}>
              {pages.map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={`/${page.replace(/\s/g, "").toLowerCase()}`}
                  sx={buttonStyle}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
            rel="noopener noreferrer"
          >
            <img
              src="/homePage.jpg"
              alt="Online Learning Vectors by Vecteezy"
              style={imageStyle}
            />
          </a>
        </div>
      </Container>
    </React.Fragment>
  );
};
