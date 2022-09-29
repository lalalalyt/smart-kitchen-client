import { ListItem, ListItemText } from "@mui/material";

export interface FridgeProps {
  id: number;
  name: string;
  type: "R" | "F";
  onClick: () => void;
}

function Fridge(props: FridgeProps) {
  const fridgeType = props.type === "R" ? "Refrigrator" : "Freezer";
  return (
    <ListItem
      button
      onClick={props.onClick}
      sx={{
        mt: 4,
        bgcolor: "secondary.light",
        boxShadow: 5,
        borderRadius: 2,
        width: 500,
        height: 80,
      }}
    >
      <ListItemText primary={props.name} secondary={fridgeType}></ListItemText>
    </ListItem>
  );
}

export default Fridge;
