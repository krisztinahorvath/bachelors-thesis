import { IconButton } from "@mui/material";
import "./ResponsiveTable.css";
import DeleteIcon from "@mui/icons-material/Delete";
const students = [
  {
    id: 1,
    name: "Alice Johnson",
    dob: "2001-04-15",
    major: "Computer Science",
  },
  { id: 2, name: "Bob Smith", dob: "2000-09-08", major: "Mathematics" },
  { id: 3, name: "Carol Williams", dob: "1999-02-23", major: "Physics" },
  // Add more student records as needed
];
export const ResponsiveTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Unique Code</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>
              <span className="cell-header">#</span> {student.id}
            </td>
            <td>
              <span className="cell-header">Name:</span> {student.name}
            </td>
            <td>
              <span className="cell-header">Unique Code:</span> {student.dob}
            </td>
            <td>
              <span className="cell-header">Email:</span> {student.major}
            </td>
            <td>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
