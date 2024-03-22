import React from "react"
import { getEmail } from "../../utils/auth-utils"

export const TeacherHomePage = () => {
    const email = getEmail();

    return (
        <React.Fragment>
          
            <h1>Congrats teacher, you logged in successfully</h1>
            <h1>Your email is: {email}</h1>
            
        </React.Fragment>
        
    )
}