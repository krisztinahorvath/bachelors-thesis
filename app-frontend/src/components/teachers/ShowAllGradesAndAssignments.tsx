import * as React from "react";
import {
  DataGrid,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridRowsProp,
  GridColDef,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { getToken } from "../../utils/auth-utils";
import { displayErrorMessage, displaySuccessMessage } from "../ToastMessage";
import { Container } from "@mui/material";

interface RegisterDTO {
  studentId: number;
  studentName: string;
  uniqueIdentificationCode: string;
  assignmentId: number;
  assignmentName: string;
  score: string;
  dateReceived: Date | null;
}

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
    axios
      .get(`${BACKEND_URL}/assignments/names/course/${courseId}`, headers)
      .then((response) => {
        setAssignments(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage("An error occurred while fetching the grades.");
        }
      });

    axios
      .get(`${BACKEND_URL}/courses/all/${courseId}`, headers)
      .then((response) => {
        const rowData: RowData[] = [];

        // Assuming the response data is an object with student IDs as keys
        Object.values(response.data).forEach((student: any, index: number) => {
          const studentData: RowData = {
            StudentName: student.StudentName,
            UniqueIdentificationCode: student.UniqueIdentificationCode,
            id: index,
          };

          // Loop through each assignment and add its score and date received to the student data
          assignments.forEach((assignment) => {
            const assignmentKey = `assignment${assignment.id}`;
            const dateReceivedKey = `dateReceived${assignment.id}`;
            const score = student[assignmentKey];
            const dateReceived = student[dateReceivedKey];

            studentData[assignmentKey] = score !== undefined ? score : null;
            studentData[dateReceivedKey] =
              dateReceived !== undefined ? new Date(dateReceived) : null; // Transform value into Date object
          });

          rowData.push(studentData);
        });

        setRows(rowData);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
        if (error.response) {
          const errorMessage = error.response.data;
          displayErrorMessage(errorMessage);
        } else {
          setLoading(false);
          displayErrorMessage("An error occurred while fetching the grades.");
        }
      });
  }, []);

  // const assignmentColumns: GridColDef[] = assignments.map((assign) => ({
  //   field: `assignment${assign.id}`,
  //   headerName: assign.name,
  //   editable: true,
  //   sortable: false,
  //   filterable: false,
  //   hideable: false,
  // }));

  const assignmentColumns: GridColDef[] = assignments.flatMap((assignment) => [
    {
      field: `assignment${assignment.id}`,
      headerName: assignment.name, // Assuming 'name' is the property containing the assignment name
      // width: 180,
      // type: "float",
      editable: true,
    },
    {
      field: `dateReceived${assignment.id}`,
      headerName: "Date Received",
      width: 180,
      type: "dateTime",
      editable: true, // TODO CHANGE THIS ************************************************
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

  return (
    <Container>
      {" "}
      {/*  style={{ height: 300, width: "50%" }}*/}
      <DataGrid
        rows={rows}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
      />
    </Container>
  );
};
