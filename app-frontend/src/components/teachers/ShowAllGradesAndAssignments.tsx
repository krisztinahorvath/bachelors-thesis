// import * as React from "react";
// import {
//   DataGrid,
//   GridCellModes,
//   GridCellModesModel,
//   GridCellParams,
//   GridRowsProp,
//   GridColDef,
// } from "@mui/x-data-grid";
// import {
//   randomCreatedDate,
//   randomTraderName,
//   randomUpdatedDate,
// } from "@mui/x-data-grid-generator";

// const columns: GridColDef[] = [
//   { field: "uniqueid", headerName: "Unique Id", width: 180, editable: false },
//   { field: "name", headerName: "Name", width: 180, editable: false },
//   { field: "age", headerName: "Age", type: "number", editable: false },
//   {
//     field: "dateCreated",
//     headerName: "Date Created",
//     type: "date",
//     width: 180,
//     editable: true,
//   },
//   {
//     field: "lastLogin",
//     headerName: "Last Login",
//     type: "dateTime",
//     width: 220,
//     editable: true,
//   },
// ];

// const rows: GridRowsProp = [
//   {
//     id: 1,
//     name: randomTraderName(),
//     age: 25,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 2,
//     name: randomTraderName(),
//     age: 36,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 3,
//     name: randomTraderName(),
//     age: 19,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 4,
//     name: randomTraderName(),
//     age: 28,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: 5,
//     name: randomTraderName(),
//     age: 23,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
// ];

// interface RegisterDTO {
//   studentId: number;
//   studentName: string;
//   gradeId: number;
//   score: string;
//   assignmentId: number;
//   assignmentName: string;
// }

// export const ShowAllGradesAndAssignments = () => {
//   const [cellModesModel, setCellModesModel] =
//     React.useState<GridCellModesModel>({});

//   const handleCellClick = React.useCallback(
//     (params: GridCellParams, event: React.MouseEvent) => {
//       if (!params.isEditable) {
//         return;
//       }

//       // Ignore portal
//       if (
//         (event.target as any).nodeType === 1 &&
//         !event.currentTarget.contains(event.target as Element)
//       ) {
//         return;
//       }

//       setCellModesModel((prevModel) => {
//         return {
//           // Revert the mode of the other cells from other rows
//           ...Object.keys(prevModel).reduce(
//             (acc, id) => ({
//               ...acc,
//               [id]: Object.keys(prevModel[id]).reduce(
//                 (acc2, field) => ({
//                   ...acc2,
//                   [field]: { mode: GridCellModes.View },
//                 }),
//                 {}
//               ),
//             }),
//             {}
//           ),
//           [params.id]: {
//             // Revert the mode of other cells in the same row
//             ...Object.keys(prevModel[params.id] || {}).reduce(
//               (acc, field) => ({
//                 ...acc,
//                 [field]: { mode: GridCellModes.View },
//               }),
//               {}
//             ),
//             [params.field]: { mode: GridCellModes.Edit },
//           },
//         };
//       });
//     },
//     []
//   );

//   const handleCellModesModelChange = React.useCallback(
//     (newModel: GridCellModesModel) => {
//       setCellModesModel(newModel);
//     },
//     []
//   );

//   return (
//     <div style={{ height: 500, width: "100%" }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         cellModesModel={cellModesModel}
//         onCellModesModelChange={handleCellModesModelChange}
//         onCellClick={handleCellClick}
//       />
//     </div>
//   );
// };
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

export const ShowAllGradesAndAssignments: React.FC<
  ShowAllGradesAndAssignmentsProps
> = ({ courseId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RegisterDTO[]>([]);
  const [assignments, setAssignments] = useState<AssignmentNameDTO[]>([]);

  useEffect(() => {
    setLoading(true);
    const headers = { headers: { Authorization: `Bearer ${getToken()}` } };
    axios
      .get(`${BACKEND_URL}/assignments/names/course/${courseId}`, headers)
      .then((response) => {
        setAssignments(response.data);
        console.log(response.data);
        console.log(assignments);
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

    // axios
    //   .get(`${BACKEND_URL}/courses/all/${courseId}`, headers)
    //   .then((response) => {
    //     setAssignments(response.data);
    //     setLoading(false);
    //   })
    //   .catch((error: any) => {
    //     if (error.response) {
    //       const errorMessage = error.response.data;
    //       displayErrorMessage(errorMessage);
    //     } else {
    //       setLoading(false);
    //       displayErrorMessage("An error occurred while fetching the grades.");
    //     }
    //   });
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
      editable: false,
    },
    {
      field: `dateReceived${assignment.id}`,
      headerName: "Date Received",
      width: 180,
      editable: false,
    },
  ]);

  const columns: GridColDef[] = [
    {
      field: "StudentName",
      headerName: "Student Name",
      width: 200,
      editable: false,
    },
    {
      field: "UniqueIdentificationCode",
      headerName: "Unique Id Code",
      width: 180,
      editable: false,
    },
    ...assignmentColumns,
  ];

  const rows: GridRowsProp = [
    {
      id: 1,
      studentId: 1974,
      studentName: "Adelle Trantow",
      uniqueIdentificationCode: "npx170tm",
      assignmentId: 55,
      assignmentName: "A1",
      score: "",
      dateReceived: null,
    },
    {
      id: 2,
      studentId: 1974,
      studentName: "Adelle Trantow",
      uniqueIdentificationCode: "npx170tm",
      assignmentId: 56,
      assignmentName: "A2",
      score: "",
      dateReceived: null,
    },
    {
      id: 3,
      studentId: 1845,
      studentName: "Ahmed Ledner",
      uniqueIdentificationCode: "4owcazzl",
      assignmentId: 55,
      assignmentName: "A1",
      score: "",
      dateReceived: null,
    },
    {
      id: 4,
      studentId: 1845,
      studentName: "Ahmed Ledner",
      uniqueIdentificationCode: "4owcazzl",
      assignmentId: 56,
      assignmentName: "A2",
      score: "",
      dateReceived: null,
    },
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
        //rows={rows}
        columns={columns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
      />
    </Container>
  );
};
