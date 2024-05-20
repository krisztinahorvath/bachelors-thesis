import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const appBarStyles = {
  position: "static",
  backgroundColor: "#ffffff",
  color: "#3d3d5c",
  boxShadow: "none",
};

const toolBarStyle = {
  paddingLeft: "2.5%",
  paddingRight: "2.5%",
};

const typographyStyle1 = {
  mr: 2,
  display: { xs: "none", md: "flex" },
  color: "inherit",
  textDecoration: "none",
  textTransform: "capitalize",
};

const boxStyle = {
  flexGrow: 1,
  display: { xs: "none", md: "flex" },
  justifyContent: "flex-end",
};

const buttonStyle = {
  my: 2,
  color: "inherit",
  display: "block",
  textTransform: "capitalize",
  fontSize: "1rem",
};

const pages = ["About us", "Log In", "Register"];

export const HomeAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
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
            Online Grades Register
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  component={Link}
                  to={`/${page.replace(/\s/g, "").toLowerCase()}`}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              textTransform: "capitalize",
            }}
          >
            Online Grades Register
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
  );
};
