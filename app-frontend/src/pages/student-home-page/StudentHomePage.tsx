import React from "react";
import { getEmail } from "../../utils/auth-utils";
import { StudentAppBar } from "../../components/students/StudentAppBar";

export const StudentHomePage = () => {
  const email = getEmail();

  return (
    <React.Fragment>
      <StudentAppBar />
      <h1>Congrats student, you logged in successfully</h1>
      <h1>Your email is: {email}</h1>
    </React.Fragment>
  );
};
