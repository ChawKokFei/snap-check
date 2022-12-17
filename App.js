import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import HomeScreen from "./navigation/HomeScreen";
import ReadingScreen from "./screens/Reading/ReadingScreen";
import WritingScreen from "./screens/Writing/WritingScreen";
import SpeakingScreen from "./screens/Speaking/SpeakingScreen";
import ListeningScreen from "./screens/Listening/ListeningScreen";
import GeneralContext from "./store/context";
import DisplayWordScreen from "./screens/Profile/DisplayWordScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GeneralContext>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Reading" component={ReadingScreen} />
          <Stack.Screen name="Listening" component={ListeningScreen} />
          <Stack.Screen name="Writing" component={WritingScreen} />
          <Stack.Screen name="Speaking" component={SpeakingScreen} />
          <Stack.Screen name="DisplayWord" component={DisplayWordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GeneralContext>
  );
}
