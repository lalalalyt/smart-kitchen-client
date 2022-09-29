import { useContext } from "react";
import { Grid } from "@mui/material";
import FridgeList from "../content/ManageFridge/FridgeList";
import ItemList from "../content/ItemList/ItemList";

import { ModeContext } from "../../contexts/ModeContext";
import { FridgeContext } from "../../contexts/FridgeContext.tsx";

function MainContainer() {
  const [mode, transit] = useContext(ModeContext);
  const { fridgeID } = useContext(FridgeContext);
  const mainPage = {
    width: "100%",
    bgcolor: "secondary.main",
    color: "primary.main",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "85vh",
  };
  return (
    <Grid container sx={mainPage}>
      {mode === "HOME" && (
        <FridgeList
          onClick={() => {
            transit("LIST");
          }}
        />
      )}
      {mode === "LIST" && <ItemList fridgeID={fridgeID} />}
    </Grid>
  );
}

export default MainContainer;
