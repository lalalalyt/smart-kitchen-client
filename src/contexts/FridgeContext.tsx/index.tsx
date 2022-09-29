import { createContext } from "react";

export const FridgeContext = createContext<{
    fridgeType: string;
    setFridgeType: React.Dispatch<React.SetStateAction<string>>;
    fridgeID: number;
    setFridgeID: React.Dispatch<React.SetStateAction<number>>;
  }>({
    fridgeType: "",
    setFridgeType: () => {},
    fridgeID: 0,
    setFridgeID: () => {},
  });