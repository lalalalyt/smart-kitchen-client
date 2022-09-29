import { useState } from "react";
import { ModeContext } from ".";

type Props = {
  children: React.ReactNode;
};

const ModeContextProvider = ({ children }: Props) => {
  const [mode, setMode] = useState("HOME");
  const transit = (newMode: string) => {
    setMode(newMode);
  };
  return (
    <ModeContext.Provider value={[mode, transit]}>
      {children}
    </ModeContext.Provider>
  );
};

export default ModeContextProvider;
