import React from "react";
import { TeacherAppBar } from "../../components/TeacherAppBar";
import { CourseCards } from "../../components/CourseCards";
import { Container, Typography } from "@mui/material";

export const TeacherHomePage = () => {
    return (
        <React.Fragment>
            <Container sx={{paddingLeft:'2.5%', paddingRight:'2.5%'}}>
                <TeacherAppBar/>
                {/* <MyCard/> */}
                <h3 style={{ textAlign: 'left', paddingLeft: '2.5%'}}>My courses:</h3>

                <CourseCards/>
            </Container>
            
            
        </React.Fragment>
        
    )
}