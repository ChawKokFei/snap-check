import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions,
  Text,
  ScrollView,
  AppState,
  ToastAndroid,
  Modal,
} from "react-native";
import { getAssetsAsync, requestPermissionsAsync } from "expo-media-library";
import PrimaryButton from "../../components/PrimaryButton";
import axios from "axios";
import MlkitOcr from "react-native-mlkit-ocr";
import Voice from "@react-native-voice/voice";
import {
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import * as Speech from "expo-speech";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import EncryptedStorage from "react-native-encrypted-storage";

// Colors
import Colors from "../../constants/colors";

// Context
import { Context } from "../../store/context";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const InputText = () => {
  const navigator = useNavigation();
  const [asset, setAsset] = useState(null);
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [wrongArray, setWrongArray] = useState([]);
  const [splittedCorrection, setSplittedCorrection] = useState([]);
  const [splittedSentence, setSplittedSentence] = useState([]);
  const [definition, setDefinition] = useState(null);
  const [recording, setRecording] = useState(false);
  const [displayDict, setDisplayDict] = useState(true);
  const [correction, setCorrection] = useState("");
  const isFocused = useIsFocused();
  const [showPasteButton, setShowPasteButton] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const appState = useRef(AppState.currentState);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkTries, setCheckTries] = useState(null);
  //const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { userID } = useContext(Context);

  const getNumberOfTries = async () => {
    try {
      //await EncryptedStorage.clear();
      let value = JSON.parse(await EncryptedStorage.getItem("check_tries"));
      if (value !== null) {
        console.log("value not null:", value);
        setCheckTries(value);
      } else {
        console.log("value null:", value);
        await EncryptedStorage.setItem("check_tries", JSON.stringify(5));
        setCheckTries(5);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deductTries = async () => {
    //await EncryptedStorage.clear();
    try {
      let value = JSON.parse(await EncryptedStorage.getItem("check_tries"));
      if (value !== null) {
        console.log("value not null:", value);
        if (value > 0) {
          await EncryptedStorage.setItem(
            "check_tries",
            JSON.stringify(value - 1)
          );
          // setCheckTries(value - 1);
          ToastAndroid.show(
            "Number of check left: " + (value - 1),
            ToastAndroid.SHORT
          );
        } else {
          setModalVisible(true);
        }
      } else {
        console.log("value null:", value);
        await EncryptedStorage.setItem("check_tries", JSON.stringify(5));
        // setCheckTries(5);
        ToastAndroid.show("Number of check left: " + 5, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const speak = (thingToSay) => {
    Speech.speak(thingToSay);
  };

  const getAsset = async () => {
    try {
      setAsset(await getAssetsAsync({ first: 1, sortBy: "modificationTime" }));
      //console.log(asset);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTextFromImage = async (uri) => {
    try {
      const result = await MlkitOcr.detectFromUri(uri);
      let tempArr = "";
      result.map((element) => {
        tempArr += element.text + "\n";
      });
      console.log(tempArr);
      setSentence(tempArr);
    } catch (error) {
      console.log(error.message);
    }
  };

  const takeImage = async () => {
    try {
      let result = await launchCameraAsync({
        aspect: [3, 3],
        quality: 1,
        allowsEditing: true,
      });
      if (result.canceled) {
        Alert.alert("Cancelled");
        navigator.navigate("Home", { screen: "CheckGrammarScreen" });
        return;
      } else {
        getTextFromImage(result.uri);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pickImage = async () => {
    try {
      let result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        aspect: [3, 3],
        quality: 1,
        allowsEditing: true,
      });
      if (result.canceled) {
        Alert.alert("Cancelled");
        navigator.navigate("Home");
        return;
      } else {
        getTextFromImage(result.uri);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const checkHandler = async () => {
    if (sentence.trim() == "") {
      Alert.alert("Please enter your sentence");
      return;
    }

    deductTries();
    getNumberOfTries();
    if (checkTries <= 1) {
      return;
    }
    setLoading(true);

    // Moved from backend to frontend
    if (sentence.length <= 500) {
      // console.log("valid");
      const sendSentence = {
        key: "j4B2oJR2Qd2VlSscQ0dHJZMhWZxwwjCP",
        text: sentence,
      };

      // failed to check sentence with newline, the prop returned wasnt correct
      // dictionary won't be displayed for sentence with newline
      // await axios({
      //   method: "POST",
      //   url: "",
      //   headers: { "Content-Type": "application/json" },
      //   data: sendSentence,
      // })
      //   .then((response) => {
      //     //regex /n newline /r carriage return /s whitespace
      //     let tempArr = [];
      //     sentence.split(" ").map((word) => {
      //       tempArr.push(word.replace(/[^a-zA-Z0-9\n\r ]/, "").toLowerCase());
      //     });

      //     // Check if sentence has newline, if yes
      //     // then set displayDict to false
      //     const match = /\n|\r/.exec(sentence);
      //     if (match) {
      //       setCorrection(response.data.sug_text);
      //       setDisplayDict(false);
      //       setLoading(false);
      //       return;
      //     }

      //     setCorrection(response.data.sug_text);
      //     setDisplayDict(true);
      //     // console.log(tempArr);
      //     setSplittedSentence(tempArr);
      //     setWrongArray(response.data.analysis[0].before.prop);
      //     // console.log(response.data.analysis[0].before.prop);
      //     setSplittedCorrection(response.data.sug_text.split(" "));
      //     // console.log(splittedCorrection);
      //     setLoading(false);
      //   })
      //   .catch(function (error) {
      //     console.log(error.message);
      //     setLoading(false);
      //   });

      setLoading(false);
    } else {
      Alert.alert("No more than 500 words");
      setLoading(false);
    }
  };

  const dictionaryHandler = async (word) => {
    console.log(word);
    await axios
      .get("https://api.dictionaryapi.dev/api/v2/entries/en/" + word)
      .then((response) => {
        //console.log(response.data[0].meanings[0].definitions);
        const temp = response.data[0].meanings[0].definitions;
        const tempArr = [];
        for (let i = 0; i < temp.length; i++) {
          tempArr.push(temp[i].definition);
        }
        setDefinition(tempArr);
      })
      .catch((error) => {
        console.log(error);
        setDefinition([]);
      });
  };

  const onSpeechPartialResults = (e) => {
    //Invoked when any results are computed
    console.log("onSpeechPartialResults: ", e);
    //setPartialResults(e.value);
    setSentence(e.value[0]);
  };

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log("onSpeechEnd: ", e);
    console.log(sentence);
    if (sentence == "Recording...") {
      setSentence("");
    }
    setRecording(false);
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log("onSpeechError: ", e);
    setSentence("");
    setRecording(false);
  };

  const startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    try {
      await Voice.start("en-US");
      //setPartialResults([]);
      setSentence("Recording...");
      setRecording(true);
    } catch (error) {
      console.error(error.message);
      setSentence("");
    }
  };

  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
      setSentence("");
      setRecording(false);
    } catch (error) {
      //eslint-disable-next-line
      console.error(error.message);
    }
  };

  const setStringFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      setSentence(clipboardContent);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStringFromClipboard = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      setShowPasteButton(true);
      setPlaceholder(clipboardContent);
    } catch (error) {
      console.log(error.message);
    }
  };

  const copyToClipboard = async () => {
    try {
      Clipboard.setString(correction);
      setPlaceholder(await Clipboard.getString());
      Alert.alert("Copied to clipboard!");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      const mediaStatus = await requestPermissionsAsync();
      const cameraStatus = await requestCameraPermissionsAsync();
      const cameraRollStatus = await requestMediaLibraryPermissionsAsync();
      if (
        mediaStatus.status !== "granted" ||
        cameraRollStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        Alert.alert("The app requires these permissions to work correctly.");
        return;
      }
      getAsset();
      getNumberOfTries();

      if (isFocused) {
        //console.log("focused");
        if (Clipboard.hasString()) {
          getStringFromClipboard();
        } else {
          setShowPasteButton(false);
          setPlaceholder("Enter your sentence here");
        }
      }
    })();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        //console.log("App has come to the foreground!");
        if (Clipboard.hasString()) {
          getStringFromClipboard();
        } else {
          setShowPasteButton(false);
          setPlaceholder("Enter your sentence here");
        }
      }

      appState.current = nextAppState;
      //setAppStateVisible(appState.current);
      //console.log("AppState", appState.current);
    });

    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
      subscription.remove();
    };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            width: width * 0.85,
            height: height * 0.95,
            alignSelf: "center",
            marginTop: (height * 0.05) / 2,
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: Colors.first,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 16, margin: 16 }}>
            You have reached the maximum amount of tries, please choose one of
            the following to continue
          </Text>
          <TouchableOpacity
            style={{
              borderRadius: 16,
              backgroundColor: Colors.fourth,
              padding: 16,
              width: width * 0.8,
              marginTop: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              setModalVisible(false);
              await EncryptedStorage.setItem(
                "check_tries",
                JSON.stringify(100)
              );
              setCheckTries(100);
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>
              Buy 100 tries (USD 0.99)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 16,
              backgroundColor: Colors.fourth,
              padding: 16,
              width: width * 0.8,
              marginTop: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              setModalVisible(false);
              await EncryptedStorage.setItem(
                "check_tries",
                JSON.stringify(1000)
              );
              setCheckTries(1000);
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>
              Buy 1000 tries (USD 4.99)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 16,
              backgroundColor: Colors.fourth,
              padding: 16,
              width: width * 0.8,
              marginTop: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={async () => {
              setModalVisible(false);
              await EncryptedStorage.setItem("check_tries", JSON.stringify(15));
              setCheckTries(15);
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>
              Watch an ad for 15 tries
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        multiline={true}
        onChangeText={(text) => setSentence(text)}
        value={sentence}
      />
      {displayDict && splittedCorrection.length > 0 && !loading && (
        <View style={styles.textOutput}>
          <ScrollView>
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              {splittedCorrection.map((word, index) => {
                const tempWord = word
                  .replace(/[^a-zA-Z0-9 ]/, "")
                  .toLowerCase();
                if (
                  wrongArray[index] !== 0 &&
                  tempWord !== splittedSentence[index]
                ) {
                  return (
                    <Text
                      key={index}
                      style={styles.correctedText}
                      onPress={async () => {
                        await dictionaryHandler(tempWord);
                      }}
                    >
                      {word + " "}
                    </Text>
                  );
                } else {
                  return <Text key={index}>{word + " "}</Text>;
                }
              })}
            </View>
          </ScrollView>
        </View>
      )}
      {!displayDict && !loading && (
        <View style={styles.textOutput}>
          <ScrollView>
            <Text>{correction}</Text>
          </ScrollView>
        </View>
      )}
      {loading && (
        <View style={styles.textOutput}>
          <Text>Checking...</Text>
        </View>
      )}
      <View style={styles.checkButton}>
        {showPasteButton && sentence == "" && (
          <PrimaryButton onPress={setStringFromClipboard}>Paste</PrimaryButton>
        )}
        {sentence !== "" && (
          <PrimaryButton
            onPress={() => {
              setSentence("");
              setWrongArray([]);
              setCorrection("");
              setSplittedCorrection([]);
              setSplittedSentence([]);
              setDefinition(null);
              setLoading(false);
              setDisplayDict(true);
            }}
          >
            Clear
          </PrimaryButton>
        )}
        <PrimaryButton onPress={checkHandler}>Check</PrimaryButton>
        {correction !== "" && (
          <PrimaryButton
            onPress={() => {
              speak(correction);
            }}
          >
            Listen
          </PrimaryButton>
        )}
        {correction !== "" && (
          <PrimaryButton onPress={copyToClipboard}>Copy</PrimaryButton>
        )}
      </View>
      {definition !== null && definition.length > 0 && (
        <View style={styles.definitionOutput}>
          <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
            Definition:
          </Text>
          <ScrollView>
            {definition.map((word, index) => {
              return (
                <Text key={index}>
                  {(index + 1).toString() + ") " + word + "\n"}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      )}
      {definition !== null && definition.length == 0 && (
        <View style={styles.definitionOutput}>
          <Text style={{ marginBottom: 20, fontWeight: "bold" }}>
            Definition not found.
          </Text>
        </View>
      )}
      <View style={styles.cameraContainers}>
        <View style={styles.cameraButtonsContainer}>
          {asset !== null && (
            <TouchableOpacity
              onPress={() => {
                pickImage();
              }}
            >
              <Image
                source={{ uri: asset.assets[0].uri }}
                style={styles.imageGalleryButton}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.cameraButtonsContainer}>
          <TouchableOpacity
            onPress={() => {
              takeImage();
            }}
          >
            <Image
              style={styles.cameraButton}
              source={require("../../assets/icons/camera-icon.png")}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.cameraButtonsContainer}>
          {!recording && (
            <TouchableOpacity onPress={startRecognizing}>
              <Image
                style={styles.micButton}
                source={require("../../assets/icons/mic-icon.png")}
              />
            </TouchableOpacity>
          )}
          {recording && (
            <TouchableOpacity onPress={stopRecognizing}>
              <Image
                style={styles.micButton}
                source={require("../../assets/icons/mic-off-icon.png")}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 28,
    margin: 8,
    padding: 16,
    width: width * 0.85,
    height: height * 0.2,
    textAlignVertical: "top",
    alignSelf: "center",
  },
  textOutput: {
    width: width * 0.85,
    alignSelf: "center",
    padding: 16,
    margin: 8,
    height: height * 0.13,
  },
  correctedText: {
    color: "red",
    fontWeight: "bold",
  },
  definitionOutput: {
    width: width * 0.85,
    alignSelf: "center",
    padding: 16,
    margin: 8,
    height: height * 0.31,
  },
  pressed: {
    opacity: 0.6,
  },
  checkButton: {
    alignSelf: "center",
    width: width * 0.85,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  cameraButtonsContainer: {
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    marginBottom: 65,
  },
  imageGalleryButton: {
    height: 50,
    width: 50,
    marginBottom: 20,
    marginLeft: 40,
  },
  cameraButton: {
    height: 80,
    width: 80,
    margin: 5,
  },
  micButton: {
    height: 65,
    width: 65,
    marginBottom: 10,
    marginRight: 40,
  },
  cameraContainers: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
  },
});

export default InputText;
