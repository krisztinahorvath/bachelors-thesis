import React from "react";


export const leftGridItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export const rightGridItemStyle: React.CSSProperties = {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
};

export const imageStyle: React.CSSProperties = {
    display: 'block',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '75%', 
    padding: 'auto'
}

export const formStyle: React.CSSProperties = {
    display: 'flex', 
    flexDirection: 'column', 
    width: '65%', 
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


// const styleSheet = document.styleSheets[0];
// styleSheet.insertRule(glowAnimation);