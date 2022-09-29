import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import axios from "axios";
import { fridgeInfo } from "./FridgeList";
import { UserContext } from "../../../contexts/UserContext";

interface AddFridgeProps {
  setFridgeList: React.Dispatch<React.SetStateAction<[fridgeInfo] | []>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddFridge = (props: AddFridgeProps) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [fridgeNameError, setFridgeNameError] = useState(false);
  const handleAddFridge = () => {
    if (user.id === 0) {
      props.setError(true);
    } else if (!open) {
      setOpen(() => true);
    }
  };

  const [fridgeState, setFridgeState] = useState({ type: "", name: "" });
  const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFridgeState({ ...fridgeState, type: event.target.value });
  };
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFridgeState({ ...fridgeState, name: event.target.value });
  };

  const handleClose = () => {
    setFridgeNameError(false);
    setFridgeState({ type: "", name: "" });
    setOpen(false);
  };

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let fridgeName = fridgeState.name;
    if (fridgeName.trim() === "") {
      setFridgeNameError(true);
      return;
    }

    setOpen(false);
    axios.post("/fridge", { ...fridgeState, user_id: user.id }).then((res) => {
      console.log(res);
      axios.get(`/user/${user.id}`).then((res) => {
        props.setFridgeList(res.data);
      });
    });
  };
  return (
    <>
      <Fab
        variant="extended"
        sx={{
          width: 250,
          ml: "10vw",
          mt: "2vw",
          bgcolor: "white",
        }}
        onClick={handleAddFridge}
      >
        <AddIcon sx={{ mr: 2 }} />
        Add a new fridge!
      </Fab>

      {user.id !== 0 && (
        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleAdd}>
            <DialogTitle>Add a new fridge</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ mb: 2 }}>
                To add new fridge into your account, please fill out the form
                below.
              </DialogContentText>
              <Grid
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                }}
              >
                <TextField
                  select
                  required
                  label="Fridge Type"
                  value={fridgeState.type}
                  onChange={handleChangeType}
                  helperText="Please select the type of your fridge"
                >
                  <MenuItem key={1} value="R">
                    Refrigerator
                  </MenuItem>
                  <MenuItem key={2} value="F">
                    Freezer
                  </MenuItem>
                </TextField>
                <TextField
                  id="name"
                  error={fridgeNameError}
                  helperText={
                    fridgeNameError ? "Please enter an valid name!" : ""
                  }
                  required
                  label="Fridge Name"
                  value={fridgeState.name}
                  onChange={handleChangeName}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button type="submit">Add</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  );
};

export default AddFridge;
