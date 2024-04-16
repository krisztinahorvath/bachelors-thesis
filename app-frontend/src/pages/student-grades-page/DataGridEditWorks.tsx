// import * as React from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 70, editable: true },
//   { field: 'firstName', headerName: 'First name', width: 130, editable: true },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//     editable: true,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const isCellEditable = (params: { row: { lastName: string } }) => {
//   // Implement your custom logic here
//   // For example, allow editing only for rows with age less than 50
//   return true;
// };

// export default function DataTable() {
//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//         // checkboxSelection
//         isCellEditable={isCellEditable}
//       />
//     </div>
//   );
// }


// https://mui.com/material-ui/react-table/

// import React, { useState } from 'react';
// import { DataGrid, GridColDef, GridEditCellPropsParams } from '@mui/x-data-grid';

// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 70, editable: true },
//   { field: 'firstName', headerName: 'First name', width: 130, editable: true },
//   { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//     editable: true,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

// const DataTable: React.FC = () => {
//   const [updatedRows, setUpdatedRows] = useState<{ [key: number]: any }>({});

//   const handleCellEditCommit = React.useCallback(
//     ({ id, field, value }: GridEditCellPropsParams) => {
//       setUpdatedRows((prevRows) => ({ ...prevRows, [id]: { ...prevRows[id], [field]: value } }));
//     },
//     []
//   );

//   const handleSaveChanges = () => {
//     // Send updatedRows to backend
//     console.log(updatedRows);
//     // Clear updatedRows after saving
//     setUpdatedRows({});
//   };

//   return (
//     <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         checkboxSelection
//         onEditCellChangeCommitted={handleCellEditCommit}
//       />
//       <button onClick={handleSaveChanges}>Save Changes</button>
//     </div>
//   );
// };

// export default DataTable;
