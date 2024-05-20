import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { getToken } from "../../utils/auth-utils";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";

const staticFields = [
  {
    // Visible in table header and when matching columns.
    label: "Student Name",
    // This is the key used for this field when we call onSubmit.
    key: "studentName",
    // Allows for better automatic column matching. Optional.
    alternateMatches: ["name"],
    // Used when editing and validating information.
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "select".
      type: "input",
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: "Stephanie Gonzalez",
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: "required",
        errorMessage: "Name is required",
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: "error",
      },
    ],
  },
  {
    // Visible in table header and when matching columns.
    label: "Unique Id Code",
    // This is the key used for this field when we call onSubmit.
    key: "uniqueIdCode",
    // Allows for better automatic column matching. Optional.
    //   alternateMatches: ["first name", "first"],
    // Used when editing and validating information.
    fieldType: {
      // There are 3 types - "input" / "checkbox" / "select".
      type: "input",
    },
    // Used in the first step to provide an example of what data is expected in this field. Optional.
    example: "iyoqk1si",
    // Can have multiple validations that are visible in Validation Step table.
    validations: [
      {
        // Can be "required" / "unique" / "regex"
        rule: "unique",
        errorMessage: "Unique Id Code is required",
        // There can be "info" / "warning" / "error" levels. Optional. Default "error".
        level: "error",
      },
    ],
  },
];

// https://www.npmjs.com/package/react-spreadsheet-import
export const ImportFromExcel: React.FC<{
  courseId: any;
  onGradesSubmitted: any;
}> = ({ courseId, onGradesSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState(staticFields);
  // const [submittedData, setSubmittedData] = useState<any[]>([]);
  //const [headerData, setHeaderData] = useState<any[]>([]);

  useEffect(() => {
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };

    axios
      .get(`${BACKEND_URL}/assignments/names/course/${courseId}`, headers)
      .then((response) => {
        const positiveFloatRegex = /^([+]?([0-9]*[.])?[0-9]+)?$/;

        const dynamicFields = response.data.flatMap(
          (assignment: { id: number; name: string; weight: number }) => [
            {
              label: `${assignment.name}`,
              key: `assignment${assignment.id}`,
              fieldType: { type: "input" },
              example: "10",
              validations: [
                {
                  rule: "regex",
                  value: positiveFloatRegex,
                  errorMessage: "Score must be a positive number",
                  level: "error",
                },
              ],
            },
            {
              label: `Date Received ${assignment.name}`,
              key: `dateReceived${assignment.id}`,
              fieldType: { type: "input" },
              example: "16/02/2024",
              validations: [],
            },
          ]
        );
        setFields([...staticFields, ...dynamicFields]);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          //setLoading(false);
          displayErrorMessage(
            "An error occurred while fetching the assignments."
          );
        }
      });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  async function onSubmit(data: any) {
    const headers = {
      headers: { Authorization: `Bearer ${getToken()}` },
    };

    const payload = data.validData.map((row: any) => {
      const assignments = [];
      for (const key in row) {
        if (
          key.startsWith("assignment") &&
          row[key] !== undefined &&
          row[key] !== ""
        ) {
          const assignmentId = parseInt(key.replace("assignment", ""));
          assignments.push({
            assignmentId: assignmentId,
            score: parseFloat(row[key]),
            dateReceived: new Date(row[`dateReceived${assignmentId}`]),
          });
        }
      }
      return {
        uniqueIdCode: row.uniqueIdCode.trim().replace(/\s/g, ""),
        assignments: assignments,
      };
    });

    try {
      const response = await axios.post(
        `${BACKEND_URL}/grades/create-from-import/${courseId}`,
        payload,
        headers
      );
      console.log("Grades submitted successfully:", response.data);
      displaySuccessMessage("Grades have been successfully submitted.");
      onGradesSubmitted();
    } catch (error: any) {
      if (error.response && error.response.data) {
        displayErrorMessage(`Error: ${error.response.data}`);
      } else {
        displayErrorMessage("An error occurred while submitting the grades.");
      }
    }
  }

  const submitButtonStyle = {
    backgroundColor: "#84B1F2",
    color: "white",
    borderRadius: "10px",
    border: "none",
    boxShadow: "0 0 10px #84B1F2",
    padding: "10px", // width
    marginTop: "0%",
    marginBottom: "0%",
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          // padding: "1rem", // Add padding as needed

          marginTop: "3%",
          marginRight: "2%",
          marginBottom: "1.5%",
          width: "100%", // Ensures the container spans full width
        }}
      >
        <Tooltip title="Import grades from a spreadsheet" arrow>
          <Button
            style={submitButtonStyle}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Import
          </Button>
        </Tooltip>
      </Box>
      <ReactSpreadsheetImport
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={onSubmit}
        fields={fields}
        // rowHook={(data, addError) => {
        //   // Validation
        //   if (data.name === "John") {
        //     addError("name", { message: "No Johns allowed", level: "info" });
        //   }
        //   // Transformation
        //   return { ...data, name: "Not John" };
        //   // Sorry John
        // }}
      />
    </>
  );
};
