import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { CategoryType } from "../ItemList/Category";
import { Inputs } from "./AddItem";
import { FridgeContext } from "../../../contexts/FridgeContext.tsx";

interface ItemInputProps {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
}

type Items = {
  id: number;
  item_name: string;
  place: "R" | "F";
  freshday: number;
  category_name: string;
};

type ItemOption = {
  inputValue?: string;
  name: string;
};

const filter = createFilterOptions<ItemOption>();

function ItemInput(props: ItemInputProps) {
  const { itemCategory, newItem, quantity, purchaseDate, bestBefore } =
    props.inputs;
  const setItemCategory = (category: string) =>
    props.setInputs((prev) => ({ ...prev, itemCategory: category }));

  const setNewItem = (item: string) =>
    props.setInputs((prev) => ({ ...prev, newItem: item }));

  const setQuantity = (quantity: number) =>
    props.setInputs((prev) => ({ ...prev, quantity }));

  const setPurchaseDate = (purchaseDate: Date | null) =>
    props.setInputs((prev) => ({ ...prev, purchaseDate }));

  const setBestBefore = (bestBefore: Date | null) =>
    props.setInputs((prev) => ({ ...prev, bestBefore }));

  // const setItemID = (ItemID: number | null) =>
  //   props.setInputs((prev) => ({ ...prev, itemID }));

  const { fridgeType } = useContext(FridgeContext);
  const [allCategory, setAllCategory] = useState<null | Array<CategoryType>>(
    null
  );
  const [itemList, setItemList] = useState<Array<Items>>([]);

  useEffect(() => {
    axios.get(`/category`).then((res) => {
      setAllCategory(res.data);
    });
  }, []);

  const handleCategory = (event: SelectChangeEvent<string>) => {
    setItemCategory(event.target.value);
    axios.get(`/item/${fridgeType}/${event.target.value}`).then((res) => {
      setItemList(res.data);
    });
  };

  const handleItemName = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ) => {
    setNewItem(value ?? "");

    axios
      .get(`/item/${fridgeType}/search/${value?.toLowerCase().trim()}`)
      .then((res) => {
        props.setInputs((prev) => ({
          ...prev,
          itemID: res.data[0] ? res.data[0].id : null,
          bestBefore: res.data[0]
            ? new Date(
                new Date().getTime() +
                  res.data[0].freshday * 24 * 60 * 60 * 1000
              )
            : null,
        }));
      });
  };

  const categoryMenu = allCategory?.map((category) => (
    <MenuItem key={category.id} value={category.name}>
      {category.name}
    </MenuItem>
  ));

  const itemOption: ItemOption[] = [];
  for (const item of itemList) {
    itemOption.push({ name: item.item_name });
  }

  return (
    <>
      <Grid
        container
        direction="row"
        wrap="wrap"
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <FormControl sx={{ width: 0.3, m: 1 }} required>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={itemCategory}
            label="Category"
            onChange={handleCategory}
            defaultValue=""
          >
            {categoryMenu}
          </Select>
        </FormControl>

        <Autocomplete
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const value = inputValue.toLowerCase().trim();
            // Suggest the creation of a new value
            const isExisting = options.some((option) => value === option.name);
            if (value !== "" && !isExisting) {
              filtered.push({ inputValue, name: `Add "${value.trim()}"` });
            }
            return filtered;
          }}
          freeSolo={true}
          selectOnFocus
          sx={{ width: 0.3, m: 1}}
          ListboxProps={{ style: {maxHeight: 120} }}
          disablePortal
          options={itemOption}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option.name;
          }}
          inputValue={newItem}
          onInputChange={handleItemName}
          renderOption={(props, option) => <li {...props}>{option.name}</li>}
          renderInput={(params) => (
            <TextField {...params} required label="Name" />
          )}
        />
        <TextField
          sx={{ width: 0.3, m: 1 }}
          type="number"
          label="Quantity"
          name="quantity"
          helperText="Optional"
          inputProps={{ min: 0, max: 10 }}
          value={quantity}
          onChange={(event) => {
            setQuantity(Number(event.target.value));
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Purchase Date"
            value={purchaseDate}
            onChange={(newValue) => {
              setPurchaseDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} required />}
          />
          <DatePicker
            label="Best Before"
            disablePast
            value={bestBefore}
            onChange={(newValue) => {
              setBestBefore(newValue);
            }}
            renderInput={(params) => <TextField {...params} required />}
          />
        </LocalizationProvider>
      </Grid>
    </>
  );
}

export default ItemInput;
