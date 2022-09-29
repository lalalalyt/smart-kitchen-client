import AppContainer from "./components/container/AppContainer";
import ModeContextProvider from "./contexts/ModeContext/provider";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  return (
    <ModeContextProvider>
      <ThemeProvider theme={theme}>
        <AppContainer />
      </ThemeProvider>
    </ModeContextProvider>
  );
}

export default App;
