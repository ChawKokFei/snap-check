import React from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";

// Colors
import Colors from "../constants/colors";

const PrimaryButton = ({ onPress, children }) => {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    margin: 4,
    //if any styling went outside of the container,
    //it would be clipped
    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: Colors.fourth,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  //this property is for iOS only
  pressed: {
    opacity: 0.6,
  },
});

export default PrimaryButton;
