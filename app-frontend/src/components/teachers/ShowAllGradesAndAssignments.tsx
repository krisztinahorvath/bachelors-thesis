import * as React from "react";
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { getToken } from "../../utils/auth-utils";
import { displayErrorMessage } from "../ToastMessage";
import { CircularProgress, Container } from "@mui/material";

interface AssignmentNameDTO {
  id: number;
  name: string;
}

interface ShowAllGradesAndAssignmentsProps {
  courseId: any;
}

interface RowData {
  id: number;
  StudentName: string;
  UniqueIdentificationCode: string;
  [key: string]: number | string | null | undefined | Date;
}

export const ShowAllGradesAndAssignments: React.FC<
  ShowAllGradesAndAssignmentsProps
> = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<RowData[]>([]);
  const [assignments, setAssignments] = useState<AssignmentNameDTO[]>([]);

  useEffect(() => {
    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };

    Promise.all([
      axios.get(`${BACKEND_URL}/assignments/names/course/${courseId}`, headers),
      axios.get(`${BACKEND_URL}/courses/all/${courseId}`, headers),
    ])
      .then(([assignmentsResponse, coursesResponse]) => {
        const assignmentsData: AssignmentNameDTO[] = assignmentsResponse.data;
        const studentsData: Record<string, any> = coursesResponse.data;

        const rowData: RowData[] = Object.entries(studentsData).map(
          ([studentId, student]) => {
            const rowData: RowData = {
              id: Number(studentId),
              StudentName: student.StudentName,
              UniqueIdentificationCode: student.UniqueIdentificationCode,
            };

            assignmentsData.forEach((assignment) => {
              const assignmentKey = `assignment${assignment.id}`;
              const dateReceivedKey = `dateReceived${assignment.id}`;
              const score = student[assignmentKey];
              const dateReceived = student[dateReceivedKey];

              rowData[assignmentKey] = score !== undefined ? score : null;
              rowData[dateReceivedKey] = dateReceived
                ? new Date(dateReceived)
                : null;
            });

            return rowData;
          }
        );

        const sortedRows = rowData.sort((a, b) =>
          a.StudentName.localeCompare(b.StudentName)
        );

        setAssignments(assignmentsData);
        setRows(sortedRows);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        setLoading(false);
        displayErrorMessage("An error occurred while fetching the grades.");
      });
  }, [courseId]);

  const assignmentColumns: GridColDef[] = assignments.flatMap((assignment) => [
    {
      field: `assignment${assignment.id}`,
      headerName: assignment.name,
      editable: true,
    },
    {
      field: `dateReceived${assignment.id}`,
      headerName: "Date Received",
      width: 180,
      type: "dateTime",
      editable: true,
    },
  ]);

  const columns: GridColDef[] = [
    {
      field: "StudentName",
      headerName: "Student Name",
      width: 200,
      editable: false,
      hideable: false,
    },
    {
      field: "UniqueIdentificationCode",
      headerName: "Unique Id Code",
      width: 180,
      editable: false,
      hideable: false,
      sortable: false,
    },
    ...assignmentColumns,
  ];

  const [cellModesModel, setCellModesModel] =
    React.useState<GridCellModesModel>({});

  const handleCellClick = React.useCallback(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (!params.isEditable) {
        return;
      }

      // Ignore portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target as Element)
      ) {
        return;
      }

      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: { mode: GridCellModes.View },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: { mode: GridCellModes.Edit },
          },
        };
      });
    },
    []
  );

  const handleCellModesModelChange = React.useCallback(
    (newModel: GridCellModesModel) => {
      setCellModesModel(newModel);
    },
    []
  );

  const processRowUpdate = React.useCallback(
    async (updatedRow: RowData, originalRow: RowData) => {
      try {
        // Extract necessary data from the updated row
        const studentId = updatedRow.id;
        const updatedFields = Object.keys(updatedRow).filter((key) =>
          key.startsWith("assignment")
        );

        let changedCell = false; // Flag to track if dateReceived was updated

        // Iterate through updated fields to find the one that changed
        for (const updatedField of updatedFields) {
          const assignmentId = parseInt(
            updatedField.replace("assignment", ""),
            10
          );
          const originalValue = originalRow[updatedField];
          const updatedValue = updatedRow[updatedField];

          // Check if the field value changed
          if (originalValue !== updatedValue) {
            changedCell = true;
            const dateReceivedKey = `dateReceived${assignmentId}`;
            let dateReceived = updatedRow[dateReceivedKey];

            // Set dateReceived to current time if it's empty
            if (!dateReceived) {
              dateReceived = new Date();
              updatedRow[dateReceivedKey] = dateReceived;
            }

            // Check if the corresponding grade is null
            const gradeKey = `grade${assignmentId}`;
            if (updatedRow[gradeKey] === null) {
              updatedRow[gradeKey] = 0;
            }

            // Construct the payload to send to the server
            const gradeDTO = {
              studentId,
              assignmentId,
              score: updatedValue,
              dateReceived,
            };

            const headers = {
              headers: { Authorization: `Bearer ${getToken()}` },
            };

            // Send the payload to the server and await the response
            const response = await axios.post(
              `${BACKEND_URL}/grades/create`,
              gradeDTO,
              headers
            );

            // Update the updated row with the new data returned by the server
            updatedRow[dateReceivedKey] = new Date(response.data.dateReceived);
            updatedRow[updatedField] = response.data.score;

            // Return the updated row to update the Data Grid internal state
            return updatedRow;
          }
        }

        // If no fields were updated, check if any dateReceived fields were updated
        if (!changedCell) {
          const dateReceivedFields = Object.keys(updatedRow).filter((key) =>
            key.startsWith("dateReceived")
          );

          for (const dateReceivedField of dateReceivedFields) {
            const assignmentId = parseInt(
              dateReceivedField.replace("dateReceived", ""),
              10
            );
            const originalValue = originalRow[dateReceivedField];
            const updatedValue = updatedRow[dateReceivedField];

            // Check if the field value changed
            if (originalValue !== updatedValue) {
              // Check if the corresponding grade is null
              const gradeKey = `assignment${assignmentId}`;
              if (updatedRow[gradeKey] === null) {
                updatedRow[gradeKey] = 0;
              }

              // Construct the payload to send to the server
              console.log(updatedRow[gradeKey]);
              const gradeDTO = {
                studentId,
                assignmentId,
                score: updatedRow[gradeKey], // Use the existing grade value
                dateReceived: updatedValue,
              };

              const headers = {
                headers: { Authorization: `Bearer ${getToken()}` },
              };

              // Send the payload to the server and await the response
              const response = await axios.post(
                `${BACKEND_URL}/grades/create`,
                gradeDTO,
                headers
              );

              // Update the updated row with the new data returned by the server
              updatedRow[dateReceivedField] = new Date(
                response.data.dateReceived
              );

              // Return the updated row to update the Data Grid internal state
              return updatedRow;
            }
          }
        }

        // If no fields were updated, return the original row
        return originalRow;
      } catch (error: any) {
        displayErrorMessage(error);
        console.log(error);
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          displayErrorMessage(
            "An error occurred while trying to create the grade."
          );
        }
        // Ensure to return the updated row even if an error occurs
        return Promise.resolve(updatedRow);
      }
    },
    []
  );

  return (
    <Container>
      <h2>Grades at all assignments:</h2>

      {loading && <CircularProgress />}

      {!loading && (
        <Container sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            cellModesModel={cellModesModel}
            onCellModesModelChange={handleCellModesModelChange}
            onCellClick={handleCellClick}
            processRowUpdate={processRowUpdate}
          />
        </Container>
      )}
    </Container>
  );
};
