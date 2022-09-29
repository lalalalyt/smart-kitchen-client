import { useState } from "react";
import { UserContext } from ".";
import { User } from "../../components/container/AppContainer";

type Props = {
  children: React.ReactNode;
};

const UserContextProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem("user");
    let initialValue;
    if (saved) {
      initialValue = JSON.parse(saved);
    }
    return initialValue || { id: 0, name: "", email: "" };
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
