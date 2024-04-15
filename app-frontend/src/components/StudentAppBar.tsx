import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Settings } from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { handleLogoutUtil } from '../utils/auth-utils';
import { Link} from "react-router-dom";

const appBarStyles = {
    position: 'static',
    backgroundColor: '#ffffff',
    color: '#3d3d5c',
    boxShadow: 'none',
    paddingLeft: '2.5%',
    paddingRight: '2.5%'
};

const toolBarStyle = {
    paddingLeft: "2.5%", 
    paddingRight: "2.5%",
}
const typographyStyle1 = {
    mr: 2,
    display: { xs: 'none', md: 'flex' },
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'capitalize'
}

const boxStyle = { 
    flexGrow: 1, 
    display: { xs: 'none', md: 'flex' }, 
    justifyContent: 'flex-end' 
}

const buttonStyle = {
    my: 2, 
    color: 'inherit', 
    display: 'block', 
    textTransform: 'capitalize', 
    fontSize: "1rem" 
}

const pages = ['Courses', 'Blog'];
const settings = ['Profile', 'My Account', 'Settings', 'Logout'];
export const StudentAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar sx={appBarStyles}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'inherit',
              textDecoration: 'none',
              textTransform: 'capitalize'
            }}
          >
            Online Grades Register
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <MenuBookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
            //   fontFamily: 'monospace',
            //   fontWeight: 700,
            //   letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              textTransform:'capitalize'
            }}
          >
            Online Grades Register
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                component={Link}
                to={`/${page.replace(/\s/g, '').toLowerCase()}`}
                onClick={handleCloseNavMenu}
                //sx={{ my: 2, color: 'white', display: 'block' }}
                sx={buttonStyle}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#8689C4' }}>
                M
              </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
                <MenuItem onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small"/>
                    </ListItemIcon>
                     Profile
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small"/>
                    </ListItemIcon>
                     My account
                </MenuItem>

                <Divider />
                
                <MenuItem onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem 
                    component={Link} to={`/`} 
                    onClick={() => { handleCloseUserMenu(); handleLogoutUtil(); }} 
                    // selected={location.pathname === `/`}
                >
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}