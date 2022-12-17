import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ProfileScreen = () => {
  const [keyword, setKeyword] = useState("");
  const [savedWords, setSavedWords] = useState([]);
  const [searchedWords, setSearchedWords] = useState([]);
  const isFocused = useIsFocused();
  const navigator = useNavigation();

  const getSavedWords = async () => {
    try {
      const savedWords = await AsyncStorage.getItem("@saved_words");
      if (savedWords) {
        const temp = JSON.parse(savedWords);
        setSavedWords(temp);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchedWords = (words) => {
    const temp = savedWords.filter((word) => {
      if (word.keyword.includes(words)) {
        return true;
      }
      for (let i = 0; i < word.definitions.length; i++) {
        if (word.definitions[i].includes(words)) {
          return true;
        }
      }
      return false;
    });

    temp.sort((a, b) => {
      if (a.keyword < b.keyword) {
        return -1;
      }
      if (a.keyword > b.keyword) {
        return 1;
      }
      return 0;
    });

    setSearchedWords(temp);
  };

  useEffect(() => {
    if (isFocused) {
      getSavedWords();
      setSearchedWords([]);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Saved words</Text>
      <TextInput
        style={styles.searchTextInput}
        placeholder="Enter search keyword here"
        onChangeText={(text) => {
          setKeyword(text);
          getSearchedWords(text);
        }}
        value={keyword}
      />
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          {searchedWords.length > 0 &&
            searchedWords.map((word, index) => {
              return (
                <View key={index} style={styles.resultContainer}>
                  <TouchableOpacity
                    style={{ paddingLeft: 16, paddingBottom: 16, width: width }}
                    onPress={() => {
                      navigator.navigate("DisplayWord", {
                        word: word,
                      });
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{word.keyword}</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      width: "100%",
                      borderColor: "black",
                    }}
                  />
                </View>
              );
            })}
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
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 42,
  },
  searchTextInput: {
    width: width * 0.85,
    borderRadius: 16,
    backgroundColor: Colors.second,
    padding: 16,
    marginTop: 16,
  },
  scrollViewContainer: {
    width: width,
    flex: 1,
    paddingVertical: 8,
    marginBottom: 65,
  },
  resultContainer: {
    width: width,
    marginTop: 16,
  },
});

export default ProfileScreen;
