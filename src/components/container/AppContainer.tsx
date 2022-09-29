import { Grid } from "@mui/material";
import FridgeContextProvider from "../../contexts/FridgeContext.tsx/provider";
import UserContextProvider from "../../contexts/UserContext/provider";
import MainContainer from "./MainContainer";
import TopNav from "./TopNavContainer";

export interface User {
  id: number;
  name: string;
  email: string;
}
function AppContainer() {
  return (
    <UserContextProvider>
      <Grid container>
        <TopNav />
        <FridgeContextProvider>
          <MainContainer />
        </FridgeContextProvider>
      </Grid>
    </UserContextProvider>
  );
}

export default AppContainer;
