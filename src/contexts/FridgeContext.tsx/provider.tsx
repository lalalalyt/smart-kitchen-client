import { useState } from "react";
import { FridgeContext } from ".";
type Props = {
  children: React.ReactNode;
};
const FridgeContextProvider = ({ children }: Props) => {
  const [fridgeID, setFridgeID] = useState<number>(0);
  const [fridgeType, setFridgeType] = useState<string>("");
  return (
    <FridgeContext.Provider
      value={{ fridgeType, setFridgeType, fridgeID, setFridgeID }}
    >
      {children}
    </FridgeContext.Provider>
  );
};

export default FridgeContextProvider;
