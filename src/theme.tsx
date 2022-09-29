import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#033876",
    },
    secondary: {
      main: "#77B0E3",
      light: "#E1F5FE",
    },
    text: {
      primary: "#033876",
      secondary: "#001936",
    },
    background: {
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: [
      "Arial",
      "sans-serif",
      "'Josefin Sans'",
      "'Dancing Script'",
    ].join(","),
  },
});

export default theme;
