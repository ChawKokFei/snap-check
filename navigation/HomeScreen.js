import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import CheckGrammarScreen from "./ToolsScreen";
import LeaderboardScreen from "../screens/Leaderboard/LeaderboardScreen";

// Colors
import Colors from "../constants/colors";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenContainerStyle={{ backgroundColor: "white" }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 65,
          backgroundColor: Colors.third,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? Colors.first : "white" },
                !focused && styles.shadow,
              ]}
            >
              <Image
                source={require("../assets/icons/home.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={CheckGrammarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? Colors.first : "white" },
                !focused && styles.shadow,
              ]}
            >
              <Image
                source={require("../assets/icons/search-circle.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? Colors.first : "white" },
                !focused && styles.shadow,
              ]}
            >
              <Image
                source={require("../assets/icons/medal.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: focused ? Colors.first : "white" },
                !focused && styles.shadow,
              ]}
            >
              <Image
                source={require("../assets/icons/person-circle-outline.png")}
                resizeMode="contain"
                style={styles.icon}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    width: 89,
    borderRadius: 16,
  },
  icon: {
    width: 31,
    height: 31,
  },
  shadow: {
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
});

export default HomeScreen;
