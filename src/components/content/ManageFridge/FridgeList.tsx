import { Box, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Fridge from "./Fridge";
import axios from "axios";
import Image from "mui-image";

import AddFridge from "./AddFridge";
import { FridgeContext } from "../../../contexts/FridgeContext.tsx";
import { UserContext } from "../../../contexts/UserContext";
import Toast from "../../topNav/Toast";

interface FridgeListProps {
  onClick: () => void;
}

export type fridgeInfo = {
  id: number;
  name: string;
  location: null | string;
  type: "R" | "F";
  user_id: number;
};

function FridgeList(props: FridgeListProps) {
  const { setFridgeType, setFridgeID } = useContext(FridgeContext);
  const { user } = useContext(UserContext);
  const [fridgeList, setFridgeList] = useState<[fridgeInfo] | []>([]);
  const [error, setError] = useState(false);
  const list = fridgeList?.map((fridge) => (
    <Fridge
      onClick={() => {
        props.onClick();
        setFridgeID(fridge.id);
        setFridgeType(fridge.type);
      }}
      id={fridge.id}
      name={fridge.name}
      type={fridge.type as "R" | "F"}
      key={fridge.id}
    />
  ));

  useEffect(() => {
    axios.get(`/user/${user.id}`).then((res) => {
      setFridgeList(res.data);
    });
    setError(false);
  }, [user]);

  const sxHomePage = {
    display: "flex",
    flexDirection: "row",
  };

  return (
    <Grid container sx={sxHomePage}>
      <Box sx={{ width: "35%", ml: "6vw", mt: "8vh" }}>
        <Image
          src="/image/fridge.jpg"
          width="33vw"
          height="33vw"
          style={{ borderRadius: 20 }}
          position="relative"
        />
      </Box>
      <Grid sx={{ width: "55%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "3%",
            pt: "10vh",
          }}
        >
          {error && (
            <Toast
              open={error}
              setOpen={setError}
              message={"Please login first!"}
              type={"error"}
            />
          )}
          <Typography
            variant="h5"
            sx={{ ml: "10vw", fontFamily: "Dancing Script", fontSize: 35 }}
          >
            Start to Manage Your Kitchen!
          </Typography>
          <AddFridge setFridgeList={setFridgeList} setError={setError} />
        </Box>

        {fridgeList.length > 0 && (
          <Grid container display="flex" justifyContent="center">
            {list}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default FridgeList;
