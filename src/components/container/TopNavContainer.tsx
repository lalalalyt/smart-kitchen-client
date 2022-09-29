import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useContext } from "react";
import { ModeContext } from "../../contexts/ModeContext";
import Authentication from "../topNav/Authentication";

function TopNav() {
  const [, transite] = useContext(ModeContext);
  const topNav = {
    bgcolor: "background.paper",
    color: "text.primary",
    width: "100%",
    height: "15vh",
    boxShadow: 0,
    alignContent: "center",
    pl: "3vw",
    pr: "3vw",
  };

  return (
    <AppBar position="static" sx={topNav}>
      <Toolbar sx={{ justifyContent: "space-between", mt: "4vh" }}>
        <Button variant="text" sx={{ textTransform: "none" }}>
          <Typography
            variant="h3"
            onClick={() => transite("HOME")}
            sx={{ fontFamily: "Josefin Sans" }}
          >
            Smart Kitchen
          </Typography>
        </Button>
        <Authentication />
      </Toolbar>
    </AppBar>
  );
}

export default TopNav;
