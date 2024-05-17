import { useLocation, useNavigate } from "react-router-dom";
import { TeacherAppBar } from "../teachers/TeacherAppBar";
import {
  Button,
  Container,
  Grid,
  TextField,
  outlinedInputClasses,
  styled,
} from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { getToken } from "../../utils/auth-utils";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
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

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "40%",
};

const textFieldStyle = {
  marginTop: "5%",
  backgroundColor: "#f5f5f5",
  border: "none",
  borderRadius: "10px",
  // height: '20%'
};

const submitButtonStyle = {
  backgroundColor: "#84B1F2",
  color: "white",
  borderRadius: "10px",
  // border: 'none',
  boxShadow: "0 0 10px #84B1F2",
  padding: "3%", // width
  marginTop: "8%",
  marginBottom: "10%",
};

export const AddAssignment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state;
  const [dateValue, setDateValue] = useState(new Date());
  const [weightError, setWeightError] = useState(false);

  const [assignment, setAssignment] = useState({
    id: 0,
    name: "",
    description: "",
    dueDate: new Date(),
    weight: 0,
    courseId: courseId,
  });

  const handleWeightChange = (event: any) => {
    const value = parseInt(event.target.value);
    setAssignment({ ...assignment, weight: value });

    if (isNaN(value) || value < 0 || value > 100) {
      setWeightError(true);
    } else {
      setWeightError(false);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      // const headers = {headers: {Authorization: `Bearer ${getToken()}`}, 'Content-Type': 'multipart/form-data'};
      await axios.post(`${BACKEND_URL}/courses/create`, assignment, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      displaySuccessMessage("The course was created successfuly!");
      navigate(-1);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        const errorMessage = error.response.data;
        displayErrorMessage(errorMessage);
      } else {
        displayErrorMessage("An error occurred while trying to create course.");
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
        <h2>Create a new assignment</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <StyledTextField
            required
            id="name"
            label="Name"
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) =>
              setAssignment({ ...assignment, name: event.target.value })
            }
          />
          <StyledTextField
            required
            id="description"
            label="Description"
            variant="outlined"
            style={textFieldStyle}
            onChange={(event) =>
              setAssignment({ ...assignment, description: event.target.value })
            }
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ marginTop: "5%" }}
              defaultValue={dayjs(dateValue)}
              onChange={(newValue) => {
                setDateValue(newValue!.toDate());
              }}
            />
          </LocalizationProvider>
          <StyledTextField
            required
            id="weight"
            label="Weight"
            variant="outlined"
            style={textFieldStyle}
            type="number"
            error={weightError}
            helperText={weightError ? "Value must be between 0 and 100" : ""}
            inputProps={{ min: 0, max: 100 }}
            onChange={handleWeightChange}
          />
          <Container />
          <Button type="submit" style={submitButtonStyle}>
            Create assignment
          </Button>
        </form>
      </Grid>
    </>
  );
};
