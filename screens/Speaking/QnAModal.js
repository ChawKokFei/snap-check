import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from "react-native";
import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";
import EncryptedStorage from "react-native-encrypted-storage";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const QnAModal = (props) => {
  const [recording, setRecording] = useState(false);
  const [sentence, setSentence] = useState("");
  const [textColor, setTextColor] = useState("black");
  const level = props.data.level;
  const word = props.data.word;

  const storeLevel = async (level, word) => {
    try {
      await EncryptedStorage.setItem(
        "speaking_level",
        JSON.stringify({ level: level, word: word })
      );
      let speakingLevel = JSON.parse(
        await EncryptedStorage.getItem("const_speaking_level")
      );
      if (speakingLevel !== null) {
        if (speakingLevel.level != "3") {
          console.log("store level", speakingLevel, level);
          await EncryptedStorage.setItem(
            "const_speaking_level",
            JSON.stringify({ level: level, pointsAdded: false })
          );
        }
      } else {
        await EncryptedStorage.setItem(
          "const_speaking_level",
          JSON.stringify({ level: level, pointsAdded: false })
        );
      }
      console.log("Stored!");
    } catch (error) {
      console.log(error);
    }
  };

  const addPoints = async () => {
    try {
      let speakingLevel = JSON.parse(
        await EncryptedStorage.getItem("const_speaking_level")
      );
      console.log("addpoints", speakingLevel);
      if (speakingLevel !== null) {
        if (speakingLevel.level == "3" && speakingLevel.pointsAdded == true) {
          return;
        }
      }
      let value = JSON.parse(await EncryptedStorage.getItem("points"));
      if (value !== null) {
        console.log("qna not null", value);
        await EncryptedStorage.setItem(
          "points",
          JSON.stringify({ points: value.points + 10 })
        );
        ToastAndroid.show("10 points added!", ToastAndroid.SHORT);
        if (speakingLevel !== null) {
          if (speakingLevel.level == "3") {
            await EncryptedStorage.setItem(
              "const_speaking_level",
              JSON.stringify({ level: "3", pointsAdded: true })
            );
          }
        }
      } else {
        console.log("qna null", value);
        await EncryptedStorage.setItem(
          "points",
          JSON.stringify({ points: 10 })
        );
        ToastAndroid.show("10 points added!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const speak = (thingToSay) => {
    Speech.speak(thingToSay);
  };

  const onSpeechPartialResults = (e) => {
    //Invoked when any results are computed
    console.log("onSpeechPartialResults: ", e);
    setSentence(e.value[0]);
    if (e.value[0] == word.toLowerCase()) {
      setTextColor("green");
    } else {
      setTextColor("red");
    }
  };

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log("onSpeechEnd: ", e);
    if (sentence == "Repeat the word...") {
      setSentence("");
      setTextColor("black");
    }
    setRecording(false);
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log("onSpeechError: ", e);
    setSentence("");
    setTextColor("black");
    setRecording(false);
  };

  const startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    try {
      await Voice.start("en-US");
      setTextColor("black");
      setSentence("Repeat the word...");
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

  useEffect(() => {
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [word, level]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.data.modalVisible}
      onRequestClose={() => {
        props.data.setModalVisible(!props.data.modalVisible);
      }}
    >
      {word !== "" && level !== null && (
        <View
          style={{
            width: width * 0.8,
            alignSelf: "center",
            marginTop: height * 0.3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: width * 0.8,
              height: height * 0.4,
              backgroundColor: Colors.first,
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text style={{ fontSize: 32, marginTop: 16 }}>Level {level}</Text>
            <TouchableOpacity
              onPress={() => {
                speak(word);
              }}
              style={{
                width: width * 0.8,
                padding: 20,
                marginVertical: 20,
                backgroundColor: Colors.second,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 4 }}>{word}</Text>
              <Text>
                Press me to <Text style={{ fontWeight: "bold" }}>listen</Text>
              </Text>
            </TouchableOpacity>
            <Text style={{ color: textColor }}>{sentence}</Text>
            {sentence == word.toLowerCase() && (
              <TouchableOpacity
                style={{
                  borderRadius: 16,
                  backgroundColor: Colors.third,
                  padding: 16,
                  width: width * 0.6,
                  marginTop: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={async () => {
                  stopRecognizing();
                  await storeLevel(level, word);
                  await addPoints();
                  setSentence("");
                  if (
                    props.data.levels.indexOf(level) !==
                    props.data.levels.length - 1
                  ) {
                    props.data.setLevel(
                      props.data.levels[props.data.levels.indexOf(level) + 1]
                    );
                    props.data.setWord(
                      props.data.words[props.data.levels.indexOf(level) + 1]
                    );
                  } else {
                    props.data.setCompleted(true);
                  }
                }}
              >
                <Text style={{ fontSize: 16 }}>Next Level</Text>
              </TouchableOpacity>
            )}
            {sentence !== word.toLowerCase() && !recording && (
              <TouchableOpacity onPress={startRecognizing}>
                <Image
                  style={styles.micButton}
                  source={require("../../assets/icons/mic-icon.png")}
                />
              </TouchableOpacity>
            )}
            {sentence !== word.toLowerCase() && recording && (
              <TouchableOpacity onPress={stopRecognizing}>
                <Image
                  style={styles.micButton}
                  source={require("../../assets/icons/mic-off-icon.png")}
                />
              </TouchableOpacity>
            )}
          </View>
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
            onPress={() => {
              props.data.setModalVisible(!props.data.modalVisible);
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  micButton: {
    height: 65,
    width: 65,
    margin: 20,
  },
});

export default QnAModal;
