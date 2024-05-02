import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { getToken } from "../utils/auth-utils";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import { displayErrorMessage, displaySuccessMessage } from "./ToastMessage";

export const EnrollDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const enrollmentKey = formJson.enrollmentkey;

          // /courses/enroll/${enrollmentKey}
          try {
            const response = await axios.post(
              `${BACKEND_URL}/courses/enroll/${enrollmentKey}`,
              //   enrollmentKey,
              {
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
              }
            );

            if (response.status === 200) {
              displaySuccessMessage("The enrollment was successfully!");
            } else {
              displayErrorMessage("Enrollment failed: "); //" + response.data.errorMessage
              //);
            }
          } catch (error: any) {
            console.log(error);
            displayErrorMessage(error);
            if (error.response) {
              const errorMessage = error.response.data;
              displayErrorMessage(error);
            } else {
              displayErrorMessage(
                "An error occurred while trying to enroll you."
              );
            }
          }

          console.log(enrollmentKey);
          handleClose();
        },
      }}
    >
      <DialogTitle>Enroll to course</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To enroll to a course, please enter its enrollement key here.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="enrollmentkey"
          name="enrollmentkey"
          label="Enrollment Key"
          //   type="string"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Enroll</Button>
      </DialogActions>
    </Dialog>
  );
};
