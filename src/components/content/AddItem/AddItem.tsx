import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import { useContext, useState } from "react";

import { ItemList } from "../ItemList/ItemList";
import { dateDifference } from "../../../helpers/dateDifference";
import InfoDialog from "./InfoDialog";
import { FridgeContext } from "../../../contexts/FridgeContext.tsx";
import { GridSelectionModel } from "@mui/x-data-grid";

export interface Inputs {
  itemCategory: string;
  newItem: string;
  quantity: number;
  purchaseDate: Date | null;
  bestBefore: Date | null;
  itemID: number | null;
}

export const defaultInputs: Inputs = {
  itemCategory: "",
  newItem: "",
  quantity: 1,
  purchaseDate: new Date(),
  bestBefore: null,
  itemID: null,
};

interface AddItemProps {
  setList: React.Dispatch<React.SetStateAction<ItemList[] | null>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<GridSelectionModel>>;
}

function AddItem({ setList, setEdit, setSelected }: AddItemProps) {
  const [add, setAdd] = useState(false);
  const { fridgeType, fridgeID } = useContext(FridgeContext);
  const [inputs, setInputs] = useState<Inputs>(defaultInputs);

  const handleClickOpen = () => {
    setAdd(true);
    setEdit(false);
    setSelected([]);
  };

  const handleClose = () => {
    setAdd(false);
    setInputs(defaultInputs);
  };
  const getListFromFridge = () => {
    axios.get(`/fridge/${fridgeID}`).then((res) => {
      res.data.length === 0 ? setList([]) : setList(res.data);
    });
  };
  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdd(false);
    // If this item has never been added before, send a post request
    if (!inputs.itemID && inputs.bestBefore && inputs.purchaseDate) {
      axios
        .post(`/item/${fridgeType}/search/${inputs.newItem}`, {
          name: inputs.newItem.toLowerCase().trim(),
          place: fridgeType,
          freshDay: dateDifference(
            inputs.bestBefore.toString(),
            inputs.purchaseDate?.toString()
          ),
          itemCategory: inputs.itemCategory,
        })
        .then((res) => {
          setInputs((prev) => ({ ...prev, itemID: res.data.id }));
          axios
            .post(`/fridge/${fridgeID}`, {
              ...inputs,
              itemID: res.data.id,
            })
            .then(() => {
              getListFromFridge();
            });
        })
        .catch((err) => console.error(err));
      // If this item has already been added, send a put request to update the freshday
    } else if (inputs.itemID && inputs.bestBefore && inputs.purchaseDate) {
      Promise.all([
        axios.put(`/item/${fridgeType}/search/${inputs.newItem}`, {
          freshDay: dateDifference(
            inputs.bestBefore.toString(),
            inputs.purchaseDate?.toString()
          ),
        }),
        axios.post(`/fridge/${fridgeID}`, inputs),
      ]).then(() => {
        getListFromFridge();
      });
    }
    setInputs(defaultInputs);
  };
  return (
    <>
      <Button
        variant={add === true ? "contained" : "text"}
        startIcon={<AddCircleIcon />}
        onClick={handleClickOpen}
        sx={{
          textTransform: "capitalize",
          fontFamily: "sans-serif",
          fontSize: 16,
          fontWeight: "bold",
          width: "80px",
        }}
      >
        add
      </Button>
      <InfoDialog
        open={add}
        inputs={inputs}
        setInputs={setInputs}
        handleClose={handleClose}
        handleSave={handleSave}
      />
    </>
  );
}

export default AddItem;
