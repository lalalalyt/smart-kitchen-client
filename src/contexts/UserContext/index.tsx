import { createContext } from "react";
import { User } from "../../components/container/AppContainer";

export const UserContext = createContext<{
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
  }>({
    user: { id: 0, name: "", email: "" },
    setUser: () => {},
  });