import { createContext } from "react";

export const ModeContext = createContext<[string, (newMode: string) => void]>([
  "HOME",
  () => {},
]);
