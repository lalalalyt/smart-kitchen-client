import {
  Typography,
  Stack,
  Button,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useEffect, useState } from "react";

import AddItem from "../AddItem/AddItem";
import ListTable from "./ListTable";
import Category, { CategoryType } from "./Category";
import { fridgeInfo } from "../ManageFridge/FridgeList";
import { GridSelectionModel } from "@mui/x-data-grid";

const fridgeType = {
  Refrigerator: "Refrigerator",
  Freezer: "Freezer",
};

export type fridgeListItem = {
  id: number;
  quantity: number;
  purchasedate: string;
  bestbefore: string;
  item_id: number;
  fridge_id: number;
  item_name: string;
  place: "R" | "F";
  freshday: number;
  category_id: number;
  category_name: string;
  fridge_name: string;
  location: string;
  type: "R" | "F";
};

type FridgeInfo = {
  fridge_id: number;
  fridge_name: string;
  location: string;
  type: "R" | "F";
};
interface ItemListProps {
  fridgeID: number;
}

function ItemList(props: ItemListProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<GridSelectionModel>([]);
  const [selectedCategory, setSelectedCategory] = useState<null | number>(null);
  const [list, setList] = useState<null | Array<fridgeListItem>>(null);
  const [category, setCategory] = useState<null | Array<CategoryType>>(null);
  const [fridgeInfo, setFridgeInfo] = useState<FridgeInfo>({
    fridge_id: 0,
    fridge_name: "",
    location: "",
    type: "R",
  });

  useEffect(() => {
    Promise.all([
      axios.get(`/fridge/${props.fridgeID}`),
      axios.get(`/fridge`),
      axios.get(`/category`),
    ]).then((res) => {
      res[0].data.length === 0 ? setList([]) : setList(res[0].data);
      const selectedFridge = res[1].data.filter(
        (fridge: fridgeInfo) => fridge.id === props.fridgeID
      );
      setFridgeInfo({
        fridge_id: selectedFridge[0].id,
        fridge_name: selectedFridge[0].name,
        location: selectedFridge[0].location,
        type: selectedFridge[0].type,
      });
      setCategory(res[2].data);
    });
  }, [props.fridgeID]);
  return (
    <>
      {!category && (
        <Box
          sx={{
            width: "100%",
            mt: "20vh",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {category && (
        <Grid container flexDirection="column">
          <Grid
            sx={{
              display: "flex",
              flexDirection: "rows",
              mr: "4%",
              ml: "16%",
            }}
          >
            <Grid sx={{ width: "40%", height: 100 }}>
              <Typography
                variant="h5"
                sx={{
                  mt: 2,
                  color: "primary.dark",
                  fontFamily: "Dancing Script",
                  fontSize: 32,
                  fontWeight: "bold",
                }}
              >
                <AcUnitIcon /> {fridgeInfo.fridge_name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  ml: 4,
                  mb: 2,
                  color: "primary.dark",
                  fontFamily: "Josefin Sans",
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {fridgeInfo.type === "R"
                  ? fridgeType.Refrigerator
                  : fridgeType.Freezer}
              </Typography>
            </Grid>

            <Stack
              direction="row"
              spacing={5}
              justifyContent="flex-end"
              sx={{ mt: 4, height: 45, width: "60%" }}
            >
              <AddItem
                setList={setList}
                setEdit={setEdit}
                setSelected={setSelected}
              />
              <Button
                variant={edit === true ? "contained" : "text"}
                sx={{
                  textTransform: "capitalize",
                  fontFamily: "sans-serif",
                  fontSize: 16,
                  fontWeight: "bold",
                  width: "80px",
                }}
                startIcon={<EditIcon />}
                onClick={() => {
                  setEdit(edit === false ? true : false);
                  setSelected([]);
                }}
              >
                edit
              </Button>
            </Stack>
          </Grid>

          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            flexDirection="row"
          >
            <Category
              selectedCategory={selectedCategory}
              onClick={setSelectedCategory}
              category={category}
            />
            <ListTable
              list={list}
              edit={edit}
              category={selectedCategory}
              selected={selected}
              setSelected={setSelected}
              setList={setList}
              setEdit={setEdit}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default ItemList;
