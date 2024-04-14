import { Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup } from '@mui/material';
import studentSVG from '../../assets/student1.svg';
import teacherSVG from '../../assets/teacher1.svg';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserType } from '../../models/User';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { displaySuccessMessage, displayErrorMessage } from '../../components/ToastMessage';
import { BACKEND_URL } from '../../constants';
import { setToken, setUserType, setEmail } from '../../utils/auth-utils';
import { StyledTextField, formStyle, submitButtonStyle, textFieldStyle } from './RegisterPageStyle';
import { HomeAppBar } from '../../components/HomeAppBar';

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [isStudentSelected, setIsStudentSelected] = useState(false);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsStudentSelected(event.target.value === "student");
  };

  const handleRegister = async (event: {preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/users/register`, user);
      setToken(response.data.token);
      setUserType(response.data.userType);
      setEmail(response.data.email);

      displaySuccessMessage("You created an account successfully!");
      navigate("/login");

      if(response.data.userType === UserType.Student){
        navigate("/student-dashboard");
      }
      else if(response.data.userType === UserType.Teacher){
        navigate("/teacher-dashboard");
      }
      else{
        displayErrorMessage("An unexpected error occured while logging in");
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

  // useEffect(() => {
  //   document.body.style.backgroundColor = '#ECF3F9';
      
  //   return () => {
  //     document.body.style.backgroundColor = '';
  //   };
  // }, []);

  return (
    <React.Fragment>
      {/* <HomeAppBar/> */}
      <h1>Create an account</h1>
      <FormControl component="fieldset">
        <FormLabel component="legend" id="demo-row-radio-buttons-group-label">Choose account type </FormLabel>
        <RadioGroup
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          row
          value={isStudentSelected ? "student" : "teacher"}
          onChange={handleRadioChange}
        >
          <Grid 
            item xs={6}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <FormControlLabel
              style={{ marginLeft: "60%" }}
              value="student"
              control={<Radio />}
              label={
                <div>
                  <img src={studentSVG} alt="student" style={{ width: "70%" }} />
                  <div style={{ textAlign: "center" }}>Student</div>
                </div>
              }
              labelPlacement="top"
            />
          </Grid>

          <Grid 
            item xs={6}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <FormControlLabel
              style={{ marginRight: "60%" }}
              value="teacher"
              control={<Radio />}
              label={
                <div>
                  <img src={teacherSVG} alt="teacher" style={{ width: "70%" }} />
                  <div style={{ textAlign: "center" }}>Teacher</div>
                </div>
              }
              labelPlacement="top"
            />
          </Grid>
        </RadioGroup>
      </FormControl>

        <Grid
          container
          // xs={7}
          direction="column"
          justifyContent="center"
          alignItems="center"
          // spacing={12}
          // width={"70%"}
        >
        {/* <Grid item> */}
        <form onSubmit={handleRegister} style={formStyle}>
            <StyledTextField 
              id="email" 
              label="Name" 
              variant="outlined"
              style={textFieldStyle}
              onChange={(event) => setUser({...user, email: event.target.value})}
            />
            <StyledTextField 
              id="email" 
              label="Email" 
              variant="outlined"
              style={textFieldStyle}
              onChange={(event) => setUser({...user, email: event.target.value})}
            />
            <StyledTextField 
              id="password" 
              label="Password" 
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              style={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleClickShowPassword} 
                      onMouseDown={handleMouseDownPassword}
                      >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) => setUser({...user, password: event.target.value})}
            />
            <StyledTextField 
              id="retype-password" 
              label="Retype password" 
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              style={textFieldStyle}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleClickShowPassword} 
                      onMouseDown={handleMouseDownPassword}
                      >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) => setUser({...user, password: event.target.value})}
            />
            {isStudentSelected && (
              <>
                <StyledTextField
                  id="nickname"
                  label="Nickname"
                  variant="outlined"
                  style={textFieldStyle} 
                />
                <StyledTextField
                  id="idcode"
                  label="Your unique identification code provided by your institution"
                  variant="outlined"
                  style={textFieldStyle}
                  onChange={(event) => setUser({ ...user, email: event.target.value })} 
                />
              </>
            )}
            <Button 
              type="submit" 
              style={submitButtonStyle}>
              Create account
            </Button>
            </form></Grid> 
    </React.Fragment>
  );
};
