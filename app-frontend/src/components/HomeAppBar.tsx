import { AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import { Link} from "react-router-dom";

const appBarStyles = {
    position: 'fixed',
    backgroundColor: '#ffffff',
    color: '#3d3d5c',
    boxShadow: 'none'
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

const pages = ['About us', 'Log In', 'Register'];
export const HomeAppBar = () => {
    return (
        <AppBar sx={appBarStyles}>
        <Container maxWidth="xl" >
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
                            to={`/${page.replace(/\s/g, '').toLowerCase()}`}
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
}