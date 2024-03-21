import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import {
	Button,
	TextField,
} from "@mui/material";
import { User, UserType } from "../../models/User";
import { setEmail, setToken, setUserType } from "../../utils/auth-utils";
import { displayErrorMessage, displaySuccessMessage } from "../../components/ToastMessage";
import {formStyle, imageStyle, leftGridItemStyle, rightGridItemStyle, submitButtonStyle} from "./LoginPageStyle";
import Grid from '@mui/material/Grid';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));



export const LoginPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>({
        email: "",
        password: "",
    });

    useEffect(() => {
      document.body.style.backgroundColor = '#ECF3F9';
      
      return () => {
          document.body.style.backgroundColor = '';
      };
    }, []);

    const handleLogin = async (event: {preventDefault: () => void }) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${BACKEND_URL}/users/login`, user);
          setToken(response.data.token);
          setUserType(response.data.userType);
          setEmail(response.data.email);

          displaySuccessMessage("The login was successful!");

          if(response.data.userType === UserType.Student){
            navigate("/student-dashboard");
          }
          else if(response.data.userType === UserType.Teacher){
            navigate("/teacher-dashboard");
          }
          else{
            displayErrorMessage("An error occured while logging in");
          }
         
        } catch (error: any) {
          console.log(error);
          if (error.response) {
            const errorMessage = error.response.data;
            displayErrorMessage(errorMessage);
          } else {
            displayErrorMessage("An error occurred while logging in.");
          }
        }      
    };



  return (
    <Grid sx={{ flexGrow: 1, height: '100vh' }} container spacing={0}>
      <Grid item xs={7} style={leftGridItemStyle}>
          <Grid item>
              <a href="https://www.vecteezy.com/free-vector/flat-design">
                <img src="src/images/signInPage.jpg" alt="Flat Design Vectors by Vecteezy" style={imageStyle}/>
              </a>
          </Grid>
      </Grid>

      <Grid item xs={5} style={rightGridItemStyle}>
       
        <h1>Welcome back</h1>
        <form onSubmit={handleLogin} style={formStyle}>
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              onChange={(event) => setUser({...user, name: event.target.value})}
            />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={(event) => setUser({...user, password: event.target.value})}
            />

            <Button type="submit" style={submitButtonStyle}>Login</Button>
          </form>

      </Grid>
      
    </Grid>
  );
};