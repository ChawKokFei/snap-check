import React, { createContext, useState } from "react";
import EncryptedStorage from "react-native-encrypted-storage";

export const Context = createContext();

const GeneralContext = ({ children }) => {
  const [userID, setUserID] = useState(null);

  const getPoints = async () => {
    try {
      let value = JSON.parse(await EncryptedStorage.getItem("points"));
      if (value !== null) {
        console.log("Context value: ", value.points);
        return value.points;
      } else {
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Context.Provider value={{ getPoints, userID, setUserID }}>
      {children}
    </Context.Provider>
  );
};

export default GeneralContext;
