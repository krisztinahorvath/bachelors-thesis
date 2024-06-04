import { useLocation, useNavigate } from "react-router-dom";
import { TeacherAppBar } from "../app-bars/TeacherAppBar";
import { Assignment } from "../../models/Assignment";
import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth-utils";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import {
  Box,
  Grid,
  Container,
  Button,
  outlinedInputClasses,
  styled,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#f5f5f5",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#84B1F2",
    },
  [`& .${outlinedInputClasses.root}`]: {
    borderRadius: "10px",
  },
});

const textFieldStyle = {
  marginTop: "5%",
  backgroundColor: "#f5f5f5",
  border: "none",
  borderRadius: "10px",
};

const submitButtonStyle = {
  backgroundColor: "#84B1F2",
  color: "white",
  borderRadius: "10px",
  boxShadow: "0 0 10px #84B1F2",
  padding: "3%", // width
  marginTop: "8%",
  marginBottom: "10%",
};

export const UpdateAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const assignmentId = location.state;
  const [assignment, setAssignment] = useState<Assignment>();
  const [dateValue, setDateValue] = useState<Date>();
  const [weightError, setWeightError] = useState(false);

  const handleWeightChange = (event: any) => {
    const value = parseInt(event.target.value);
    setAssignment({ ...assignment, weight: value });

    if (isNaN(value) || value < 0 || value > 100) {
      setWeightError(true);
    } else {
      setWeightError(false);
    }
  };

  useEffect(() => {
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/assignments/${assignmentId}`, headers)
      .then((response) => {
        setAssignment(response.data);
        setDateValue(response.data.dueDate);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          displayErrorMessage(
            "An error occurred while fetching the assignments."
          );
        }
      });
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      assignment!.dueDate = new Date(dateValue!);
      console.log(assignment?.dueDate);
      await axios.put(
        `${BACKEND_URL}/assignments/${assignmentId}`,
        assignment,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      displaySuccessMessage("The assignment was updated successfuly!");
      navigate(-1);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage(
          "An error occurred while trying to update the assignment."
        );
      }
    }
  };

  return (
    <>
      <TeacherAppBar />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Update assignment</h2>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "80%", sm: "40%" },
          }}
        >
          <StyledTextField
            required
            id="name"
            label="Name"
            value={assignment?.name}
            variant="outlined"
            style={textFieldStyle}
            InputLabelProps={{ shrink: true }}
            onChange={(event) =>
              setAssignment({ ...assignment, name: event.target.value })
            }
          />
          <StyledTextField
            required
            id="description"
            label="Description"
            value={assignment?.description}
            variant="outlined"
            style={textFieldStyle}
            InputLabelProps={{ shrink: true }}
            onChange={(event) =>
              setAssignment({ ...assignment, description: event.target.value })
            }
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ marginTop: "5%" }}
              label="Due Date"
              value={dayjs(dateValue)}
              onChange={(newValue) => {
                setDateValue(newValue!.toDate());
              }}
            />
          </LocalizationProvider>
          <TextField
            required
            id="weight"
            label="Weight"
            value={assignment?.weight}
            variant="outlined"
            style={textFieldStyle}
            type="number"
            error={weightError}
            helperText={weightError ? "Value must be between 0 and 100." : ""}
            inputProps={{ min: 0, max: 100 }}
            InputLabelProps={{ shrink: true }}
            onChange={handleWeightChange}
          />
          <Container />
          <Button type="submit" style={submitButtonStyle}>
            Update assignment
          </Button>
        </Box>
      </Grid>
    </>
  );
};
