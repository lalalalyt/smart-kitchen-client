import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Inputs } from "./AddItem";
import ItemInput from "./ItemInput";

interface InfoDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSave: (event: React.FormEvent<HTMLFormElement>) => void;
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
}

const InfoDialog = (props: InfoDialogProps) => {
  const { open, inputs, setInputs, handleClose, handleSave } = props;
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <form onSubmit={handleSave}>
        <DialogTitle>Add new item</DialogTitle>
        <DialogContent>
          <ItemInput
            inputs={inputs}
            setInputs={setInputs}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InfoDialog;
