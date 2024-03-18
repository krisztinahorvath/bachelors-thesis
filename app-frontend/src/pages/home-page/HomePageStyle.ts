import React from "react";

export const appBarStyles = {
    position: 'fixed',
    backgroundColor: '#ffffff',
    color: '#3d3d5c',
    boxShadow: 'none'
};

export const toolBarStyle = {
    paddingLeft: "2.5%", 
    paddingRight: "2.5%",
}

export const typographyStyle1 = {
    mr: 2,
    display: { xs: 'none', md: 'flex' },
    color: 'inherit',
    textDecoration: 'none',
    textTransform: 'capitalize'
}

export const boxStyle = { 
    flexGrow: 1, 
    display: { xs: 'none', md: 'flex' }, 
    justifyContent: 'flex-end' 
}

export const buttonStyle = {
    my: 2, 
    color: 'inherit', 
    display: 'block', 
    textTransform: 'capitalize', 
    fontSize: "1rem" 
}

export const textContainerStyle = {
    position: 'absolute',
    top: '40%',
    left: '17%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'left',
    width: '30%',
    paddingLeft: "2.5%", 
}

export const typographyStyle2 = {
    fontWeight: 'bold', 
    paddingBottom: "7.5%"
}

export const typographyStyle3 = {
    fontSize: "1.1rem"
}

export const divStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '-10%', 
    right: '-30%', 
    zIndex: 0 
};

export const imageStyle: React.CSSProperties = {
    width: '55%', 
    height: '55%', 
    borderRadius: '10%' 
}