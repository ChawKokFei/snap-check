import React from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const RankingItem = (props) => {
  console.log(props.nameList);
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{props.title}</Text>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.mushroomScrollContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {props.nameList !== null &&
          props.nameList.length > 0 &&
          props.nameList.map((item, index) => {
            return (
              <View key={index} style={{ width: width * 0.85 }}>
                <View style={{ width: width * 0.85, flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: "white",
                        margin: 14,
                        alignSelf: "flex-start",
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 24,
                        color: "white",
                        margin: 14,
                        alignSelf: "flex-end",
                      }}
                    >
                      {item.points + " points"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    width: "100%",
                    borderColor: "white",
                  }}
                />
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.85,
    marginBottom: 20,
    height: height * 0.35,
  },
  titleText: {
    paddingBottom: 8,
    fontSize: 24,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 3.5,
    textShadowColor: "#c5c5c5",
    textShadowOpacity: 0.25,
    alignSelf: "flex-start",
  },
  mushroomScrollContainer: {
    borderRadius: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    backgroundColor: Colors.fourth,
    width: width * 0.85,
    height: height * 0.3,
  },
});

export default RankingItem;
