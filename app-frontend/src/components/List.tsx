import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Demo() {
  // Function to generate list items with specified fields
  const generate = (items: any[]) => {
    return items.map((item) => (
      <ListItem
        key={item.id}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <ListItemText primary={item.id} sx={{ flex: 1 }} />
        <ListItemText primary={item.name} sx={{ flex: 1 }} />
        <ListItemText primary={item.age} sx={{ flex: 1 }} />
        <ListItemText primary={"sdsajfhgfdk"} sx={{ flex: 1 }} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => handleDelete(item.id)}
          >
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));
  };

  // Dummy function to handle delete action (You can replace it with your actual delete function)
  const handleDelete = (id: any) => {
    console.log(`Deleting item with id: ${id}`);
  };

  // Dummy data for the list
  const people = [
    { id: 1, name: "John Doefdsfdsfdsdsd", age: 30 },
    { id: 2, name: "Jane Smithdsad", age: 25 },
    { id: 3, name: "Alice Johnson", age: 355345345435345534534535 },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          List of People
        </Typography>
        <List>
          {/* Header for the list */}
          <ListItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ListItemText primary="#" sx={{ flex: 1 }} />
            <ListItemText primary="Name" sx={{ flex: 1 }} />
            <ListItemText primary="Age" sx={{ flex: 1 }} />
            <ListItemText primary="Extra Field" sx={{ flex: 1 }} />
            <ListItemSecondaryAction></ListItemSecondaryAction>
          </ListItem>
          {/* List items */}
          {generate(people)}
        </List>
      </Grid>
    </Box>
  );
}
