import {
    TextField,
    outlinedInputClasses,
    styled,
} from "@mui/material";
  
import React from "react";

export const StyledTextField = styled(TextField)({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: "#f5f5f5"
    },
    [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: "#84B1F2"
    },
    [`& .${outlinedInputClasses.root}`]: {
      borderRadius: "10px", 
    },
  });

export const formStyle: React.CSSProperties = {
    display: 'flex', 
    flexDirection: 'column', 
    width: '40%', 
}

export const textFieldStyle = {
    marginTop: '5%',
    backgroundColor: '#f5f5f5',
    border: 'none',
    borderRadius: '10px',
    // height: '20%'
};

export const submitButtonStyle = {
    backgroundColor: '#84B1F2', 
    color: 'white',
    borderRadius: '10px',
    // border: 'none',
    boxShadow: '0 0 10px #84B1F2', 
    padding: '3%', // width
    marginTop: '15%',
    marginBottom: '10%'
};