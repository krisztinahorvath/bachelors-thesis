import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { getEmail, getToken, handleLogoutUtil } from "../../utils/auth-utils";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { UserType } from "../../models/User";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";

export const DeleteAccountDialog: React.FC<{
  open: boolean;
  handleClose: () => void;
  userType: UserType;
}> = ({ open, handleClose, userType }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          try {
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const password = formJson.password;

            const headers = {
              headers: { Authorization: `Bearer ${getToken()}` },
            };

            const response = await axios.delete(
              `${BACKEND_URL}/users/account/${getEmail()}/${password}`,
              headers
            );

            if (response.status === 204) {
              displaySuccessMessage("Account deleted successful!");
              handleLogoutUtil();
              navigate("/");
            } else {
              displayErrorMessage("Account deletion failed!");
            }
          } catch (error: any) {
            if (error.response) {
              const errorMessage = error.response.data;
              displayErrorMessage(`Account deletion failed: ${errorMessage}`);
            } else {
              displayErrorMessage(
                "An error occurred while trying to delete your account."
              );
            }
          }

          handleClose();
        },
      }}
    >
      <DialogTitle>Delete account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete your account, please enter your password here.{" "}
          {userType === UserType.Teacher && (
            <span style={{ color: "red" }}>
              {" "}
              You will lose access to all your data and it will be deleted
              forever. Make sure to save offline anything you might need in the
              future.
            </span>
          )}
          {userType === UserType.Student && (
            <span style={{ color: "red", display: "block" }}>
              If you are enrolled in any courses, all your grades will be
              deleted from that course, this might lead to failing your course,
              please be aware.
            </span>
          )}
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="password"
          name="password"
          label="Password"
          fullWidth
          variant="standard"
          type={showPassword ? "text" : "password"}
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
