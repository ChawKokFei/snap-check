import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const DictionaryScreen = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searching, setSearching] = useState(false);
  const [constKeyword, setConstKeyword] = useState("");

  const isPrintableASCII = (str) => {
    return /^[0-9A-Za-z\s]*$/.test(str);
  };

  const dictionaryHandler = async (word) => {
    console.log(word);
    setSearching(true);
    await axios
      .get("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
      .then((response) => {
        console.log(response.data[0].meanings[0].definitions);
        const temp = response.data[0].meanings[0].definitions;
        const tempArr = [];
        for (let i = 0; i < temp.length; i++) {
          tempArr.push(temp[i].definition);
        }
        setSearchResult(tempArr);
        setSearching(false);
      })
      .catch((error) => {
        console.log(error);
        setSearchResult([]);
        setSearching(false);
      });
  };

  const saveHandler = async () => {
    try {
      const savedWords = await AsyncStorage.getItem("@saved_words");
      if (constKeyword !== "" && !savedWords) {
        await AsyncStorage.setItem(
          "@saved_words",
          JSON.stringify([{ keyword: constKeyword, definitions: searchResult }])
        );
      } else if (constKeyword !== "" && savedWords) {
        for (let i = 0; i < JSON.parse(savedWords).length; i++) {
          if (
            JSON.parse(savedWords)[i].keyword.toLowerCase() ===
            constKeyword.toLowerCase()
          ) {
            Alert.alert("This word is already saved!");
            return;
          }
        }
        const temp = JSON.parse(savedWords);
        temp.push({ keyword: constKeyword, definitions: searchResult });
        await AsyncStorage.setItem("@saved_words", JSON.stringify(temp));
      } else {
        Alert.alert("Error", "Please enter a keyword");
        return;
      }
      Alert.alert("Success", "Word saved successfully");
      console.log(JSON.parse(await AsyncStorage.getItem("@saved_words")));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchTextInput}
        placeholder="Type your keyword here"
        onChangeText={(text) => {
          setKeyword(text);
        }}
        value={keyword}
        onSubmitEditing={({ nativeEvent }) => {
          if (!isPrintableASCII(nativeEvent.text.trim())) {
            Alert.alert("Please enter a valid keyword");
            return;
          }

          if (nativeEvent.text.trim() !== "") {
            dictionaryHandler(keyword);
            setConstKeyword(keyword);
          }
        }}
        blurOnSubmit={false}
      />
      <ScrollView style={{ width: width }}>
        <View style={{ width: width, marginBottom: 65, alignItems: "center" }}>
          {searchResult !== null && searchResult.length > 0 && (
            <View style={styles.definitionOutput}>
              <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
                Definition:
              </Text>
              <ScrollView nestedScrollEnabled={true}>
                {searchResult.map((word, index) => {
                  return (
                    <Text key={index}>
                      {(index + 1).toString() + ") " + word + "\n"}
                    </Text>
                  );
                })}
              </ScrollView>
            </View>
          )}
          {searchResult !== null && searchResult.length == 0 && (
            <View style={styles.definitionOutput}>
              <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
                Definition not found.
              </Text>
            </View>
          )}
          {searching && (
            <View style={styles.definitionOutput}>
              <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
                Seaching...
              </Text>
            </View>
          )}
          {searchResult !== null && searchResult.length > 0 && (
            <TouchableOpacity style={styles.saveButton} onPress={saveHandler}>
              <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    height: height * 0.63,
  },
  searchTextInput: {
    width: width * 0.85,
    borderRadius: 16,
    backgroundColor: Colors.second,
    padding: 16,
    marginTop: 16,
  },
  saveButton: {
    width: width * 0.85,
    borderRadius: 16,
    backgroundColor: Colors.fourth,
    padding: 16,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DictionaryScreen;
