// import 'react-data-grid/lib/styles.css';
// import React, { useState } from 'react';
// import DataGrid, { CellSelectArgs } from 'react-data-grid';

// const columns = [
//   { key: 'id', name: 'ID' },
//   { key: 'title', name: 'Title', editable: true }, // Make 'Title' column editable
//   { key: 'name', name: 'Name', editable: true } // Make 'Name' column editable
// ];

// const initialRows = [
//   { id: 0, title: 'Example', name: 'Ana' },
//   { id: 1, title: 'Demo', name: 'John' },
//   { id: 2, title: 'Demo2', name: 'Alice' }
// ];

// export const StudentGradesPage = () => {
//   const [rows, setRows] = useState(initialRows);

//   const handleRowsUpdate = ({ cellKey, rowIdx, updated }: CellSelectArgs<typeof columns[0], typeof rows[0]>) => {
//     setRows((prevRows) => {
//       const newRows = [...prevRows];
//       newRows[rowIdx] = { ...newRows[rowIdx], [cellKey]: updated };
//       return newRows;
//     });
//   };

//   return (
//     <DataGrid
//       columns={columns}
//       rows={rows}
//       onSelectedCellChange={handleRowsUpdate}
//       enableCellSelect={true} // Allows cell selection
//     />
//   );
// };
