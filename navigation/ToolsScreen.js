import React from "react";
import GrammarCheckerScreen from "../screens/Tools/GrammarCheckerScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DictionaryScreen from "../screens/Tools/DictionaryScreen";

const Drawer = createDrawerNavigator();

const CheckGrammarScreen = (props) => {
  return (
    <Drawer.Navigator initialRouteName="GrammarChecker">
      <Drawer.Screen
        name="GrammarChecker"
        component={GrammarCheckerScreen}
        options={{ title: "Grammar Checker" }}
      />
      <Drawer.Screen
        name="Dictionary"
        component={DictionaryScreen}
        options={{ title: "Dictionary" }}
      />
    </Drawer.Navigator>
  );
};

export default CheckGrammarScreen;
