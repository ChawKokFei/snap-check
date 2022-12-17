import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

// Components
import QnAModal from "./QnAModal";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const LEVELS = ["1", "2", "3"];
const WORDS = ["Near", "Penguin", "Tiger"];

const SpeakingScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [level, setLevel] = useState(null);
  const [word, setWord] = useState("");
  const [completed, setCompleted] = useState(false);

  const getLevel = async () => {
    console.log("get level");
    try {
      let value = JSON.parse(await EncryptedStorage.getItem("speaking_level"));
      if (value !== null) {
        if (LEVELS.indexOf(value.level) !== LEVELS.length - 1) {
          setLevel(LEVELS[LEVELS.indexOf(value.level) + 1]);
          setWord(WORDS[LEVELS.indexOf(value.level) + 1]);
        } else {
          setCompleted(true);
          setLevel(value.level);
          setWord(value.word);
        }
      } else {
        setLevel(LEVELS[0]);
        setWord(WORDS[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetLevel = async () => {
    try {
      await EncryptedStorage.removeItem("speaking_level");
      setLevel(LEVELS[0]);
      setWord(WORDS[0]);
      setCompleted(false);
    } catch (error) {
      console.log(error);
    }
  };

  const clearEncryptedStorage = async () => {
    try {
      await EncryptedStorage.clear();
      console.log("Storage cleared!");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    //clearEncryptedStorage();
    getLevel();
  }, []);

  return (
    <View style={styles.container}>
      {!completed && modalVisible && level !== null && word !== "" && (
        <QnAModal
          data={{
            levels: LEVELS,
            words: WORDS,
            level: level,
            modalVisible: modalVisible,
            setModalVisible: setModalVisible,
            word: word,
            setLevel: setLevel,
            setWord: setWord,
            setCompleted: setCompleted,
          }}
        />
      )}
      {modalVisible && completed && (
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
              width: width * 0.8,
              height: height * 0.4,
              alignSelf: "center",
              marginTop: height * 0.3,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.first,
              borderRadius: 20,
            }}
          >
            <Text style={{ fontSize: 24, textAlign: "center", lineHeight: 40 }}>
              Congratulations!{"\n"}You have completed{"\n"}this module!
            </Text>
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
              onPress={resetLevel}
            >
              <Text style={{ fontSize: 16 }}>Start from Level 1</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={{ fontSize: 24 }}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: Colors.second,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SpeakingScreen;
