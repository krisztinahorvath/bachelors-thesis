import { BACKEND_URL } from "../constants";
import axios from "axios";
import { displayErrorMessage, displaySuccessMessage } from "./ToastMessage";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getToken } from "../utils/auth-utils";
import React from "react";

export const DeleteDialog: React.FC<{
  serverUrl: string;
  title: string;
  description: string;
}> = ({ serverUrl, title, description }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (event: { preventDefault: () => void }) => {
    setOpen(false);
    event.preventDefault();

    try {
      const authToken = getToken();
      await axios.delete(`${BACKEND_URL}/${serverUrl}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      displaySuccessMessage("Student removed successfully!");
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        displayErrorMessage(error.response.data);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};
