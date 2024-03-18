import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
    Container
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { User, UserType } from "../../models/User";
import { setEmail, setToken, setUserType } from "../../utils/auth-utils";
import { displayErrorMessage, displaySuccessMessage } from "../../components/ToastMessage";

export const LoginPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>({
        email: "",
        password: "",
    });

    const handleLogin = async (event: {preventDefault: () => void }) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${BACKEND_URL}/users/login`, user);
          setToken(response.data.token);
          setUserType(response.data.userType);
          setEmail(response.data.email);

          displaySuccessMessage("The login was successful!");

          if(response.data.userType === UserType.Student){
            navigate("/student-homepage");
          }
          else if(response.data.userType === UserType.Teacher){
            navigate("/teacher-homepage");
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
    <Container>
      <h1>Login</h1>
        <Card>
            <CardContent>
                <IconButton component={Link} sx={{ mr: 3 }} to={`/`}>
                    <ArrowBackIcon />
                </IconButton>{" "}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
                    <TextField
                        id="email"
                        label="Email"
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

                    <Button type="submit">Login</Button>
                </form>
            </CardContent>
            <CardActions></CardActions>
        </Card>
    </Container>
);
};