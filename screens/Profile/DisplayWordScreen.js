import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const DisplayWordScreen = (props) => {
  const word = props.route.params.word;
  const navigator = useNavigation();

  const deleteHandler = async () => {
    try {
      const savedWords = await AsyncStorage.getItem("@saved_words");
      if (savedWords) {
        const temp = JSON.parse(savedWords);
        const newTemp = temp.filter((item) => {
          if (item.keyword !== word.keyword) {
            return true;
          }
          return false;
        });
        await AsyncStorage.setItem("@saved_words", JSON.stringify(newTemp));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    navigator.setOptions({
      title: word.keyword,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.definitionOutput}>
        <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
          Definition:
        </Text>
        <ScrollView>
          {word.definitions.map((word, index) => {
            return (
              <Text key={index}>
                {(index + 1).toString() + ") " + word + "\n"}
              </Text>
            );
          })}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Are you sure?",
            "Are you sure you want to delete " + word.keyword + "?",
            [
              {
                text: "Delete",
                onPress: async () => {
                  await deleteHandler();
                  navigator.dispatch(StackActions.pop());
                },
              },
              { text: "Cancel" },
            ]
          );
        }}
      >
        <Text style={{ fontSize: 16, color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  definitionOutput: {
    width: width * 0.85,
    alignSelf: "center",
    padding: 8,
    margin: 8,
    height: height * 0.8,
  },
  deleteButton: {
    width: width * 0.85,
    borderRadius: 16,
    backgroundColor: Colors.fourth,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DisplayWordScreen;
