import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ToastAndroid,
  Modal,
} from "react-native";
import * as Speech from "expo-speech";
import EncryptedStorage from "react-native-encrypted-storage";

// Colors
import Colors from "../../constants/colors";
import Question from "../Reading/Question";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const QUESTIONS = {
  title: "My holiday trip",
  text: "I went to Kota Kinabalu last week. I was accompanied by my younger brother and my parents. We stayed at a hotel near the beach. We went to the beach every day. We swam in the sea and played in the sand. We also went to the zoo. We saw many animals there. We saw monkeys, elephants, tigers, and many other animals. We also went to the aquarium. We saw many fish there. We saw sharks, dolphins, and many other fish. We had a great time there. We will go there again next year.",
};

const ListeningScreen = () => {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [answer, setAnswer] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [marksVisible, setMarksVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [triesVisible, setTriesVisible] = useState(false);
  const [viewTextAdVisible, setViewTextAdVisible] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [viewAnswerAdVisible, setViewAnswerAdVisible] = useState(false);
  const [tries, setTries] = useState(null);
  const [marks, setMarks] = useState(0);

  const speak = (thingToSay) => {
    Speech.speak(thingToSay);
    setSpeaking(true);
  };

  const stopSpeak = () => {
    Speech.stop();
    setSpeaking(false);
  };

  const processMarks = async (marks) => {
    console.log("process marks function, number of tries: ", tries);
    console.log("process marks function, marks:", marks);
    try {
      // Points to add
      let points = 0;

      // First save the latest mark
      let readingMarks = JSON.parse(
        await EncryptedStorage.getItem("const_listening_marks")
      );

      if (readingMarks !== null) {
        // update mark only if the mark is higher than the one saved
        if (readingMarks.marks < marks) {
          points = (marks - readingMarks.marks) * 10;
          await EncryptedStorage.setItem(
            "const_listening_marks",
            JSON.stringify({ marks: marks, pointsAdded: false })
          );
        }
      } else {
        points = marks * 10;
        await EncryptedStorage.setItem(
          "const_listening_marks",
          JSON.stringify({ marks: marks, pointsAdded: false })
        );
      }

      // Then add the points
      let value = JSON.parse(await EncryptedStorage.getItem("points"));
      if (value !== null) {
        // Add points to the accumulated points
        await EncryptedStorage.setItem(
          "points",
          JSON.stringify({ points: value.points + points })
        );
      } else {
        await EncryptedStorage.setItem(
          "points",
          JSON.stringify({ points: points })
        );
      }

      console.log(
        "points after process: ",
        JSON.parse(await EncryptedStorage.getItem("points"))
      );
      console.log(
        "marks after process: ",
        JSON.parse(await EncryptedStorage.getItem("const_listening_marks"))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNumberOfTries = async () => {
    try {
      //await EncryptedStorage.clear();
      let value = JSON.parse(await EncryptedStorage.getItem("listening_tries"));
      if (value !== null) {
        //console.log("value not null:", value);
        setTries(value);
      } else {
        //console.log("value null:", value);
        await EncryptedStorage.setItem("listening_tries", JSON.stringify(3));
        setTries(3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deductTries = async () => {
    //await EncryptedStorage.clear();
    try {
      let value = JSON.parse(await EncryptedStorage.getItem("listening_tries"));
      if (value !== null) {
        //console.log("value not null:", value);
        if (value > 0) {
          await EncryptedStorage.setItem(
            "listening_tries",
            JSON.stringify(value - 1)
          );
          setTries(value - 1);
          checkAnswer();
          ToastAndroid.show(
            "Number of tries left: " + (value - 1),
            ToastAndroid.SHORT
          );
        } else {
          setTries(0);
          setTriesVisible(true);
        }
      } else {
        //console.log("value null:", value);
        await EncryptedStorage.setItem("listening_tries", JSON.stringify(3));
        setTries(3);
        checkAnswer();
        ToastAndroid.show("Number of tries left: " + 3, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAnswer = () => {
    console.log(answer);
    setMarks(0);
    let localMarkCount = 0;
    if (answer[1] == "4") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[2] == "2") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[3] == "1") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[4] == "4") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    console.log("after checking answer:", marks);
    processMarks(localMarkCount);
    setMarksVisible(true);
  };

  useEffect(() => {
    getNumberOfTries();
  }, []);

  return (
    <View style={styles.container}>
      {questionVisible && (
        <View style={styles.questionContainer}>
          <ScrollView>
            <View style={styles.scrollViewContainer}>
              <Text style={styles.titleText}>{QUESTIONS.title}</Text>
              {textVisible && (
                <View style={{ width: width * 0.85 }}>
                  <Text style={styles.questionText}>{QUESTIONS.text}</Text>
                </View>
              )}

              <Modal
                animationType="fade"
                transparent={true}
                visible={viewTextAdVisible}
                onRequestClose={() => {
                  setViewTextAdVisible(!viewTextAdVisible);
                }}
              >
                <View style={styles.modalContainer}>
                  <Text style={{ fontSize: 16, margin: 16 }}>
                    Watch an ad to view the original text
                  </Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={async () => {
                      setViewTextAdVisible(false);
                      setTextVisible(true);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "white" }}>
                      Watch ad to view original text
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      setViewTextAdVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "white" }}>Close</Text>
                  </TouchableOpacity> */}
                </View>
              </Modal>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: Colors.third }]}
                onPress={() => {
                  if (speaking) {
                    stopSpeak();
                  } else {
                    speak(QUESTIONS.text);
                  }
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {speaking ? "Stop" : "Listen"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: "#f58442" }]}
                onPress={() => {
                  if (textVisible) {
                    setTextVisible(false);
                  } else {
                    setViewTextAdVisible(true);
                  }
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {!textVisible ? "View original text" : "Hide original text"}
                </Text>
              </TouchableOpacity>
              <View style={{ width: width * 0.85 }}>
                <Question
                  questionNo={1}
                  setAnswer={setAnswer}
                  qna={{
                    question: "1) I went to...",
                    answers: {
                      1: "Singapore",
                      2: "Kuala Selangor",
                      3: "Kuala Lumpur",
                      4: "Kota Kinabalu",
                    },
                  }}
                />
                <Question
                  questionNo={2}
                  setAnswer={setAnswer}
                  qna={{
                    question: "2) I was accompanied by...",
                    answers: {
                      1: "My elder sister",
                      2: "My younger brother",
                      3: "My friends",
                      4: "My grandparents",
                    },
                  }}
                />
                <Question
                  questionNo={3}
                  setAnswer={setAnswer}
                  qna={{
                    question: "3) We stayed at...",
                    answers: {
                      1: "A hotel near the beach",
                      2: "A hotel near the zoo",
                      3: "A hotel near the aquarium",
                      4: "A hotel near the airport",
                    },
                  }}
                />
                <Question
                  questionNo={4}
                  setAnswer={setAnswer}
                  qna={{
                    question: "4) We did not go to the...",
                    answers: {
                      1: "Beach",
                      2: "Zoo",
                      3: "Aquarium",
                      4: "Airport",
                    },
                  }}
                />
              </View>
              {marksVisible && (
                <Text style={{ fontSize: 24, marginTop: 16, marginBottom: 8 }}>
                  Your marks: {marks}/4
                </Text>
              )}
              <TouchableOpacity
                style={styles.checkAnswerButton}
                onPress={async () => {
                  await deductTries();
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {tries !== 0 ? "Check answer" : "Try again"}
                </Text>
              </TouchableOpacity>
              {answerVisible && (
                <Text style={{ fontSize: 16, marginBottom: 16 }}>
                  {
                    "1) Kota Kinabalu\n2) My younger brother\n3) A hotel near the beach\n4) Airport"
                  }
                </Text>
              )}
              <TouchableOpacity
                style={styles.viewAnswerButton}
                onPress={() => {
                  if (answerVisible) {
                    setAnswerVisible(false);
                  } else {
                    setViewAnswerAdVisible(true);
                  }
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {!answerVisible ? "View answer" : "Hide answer"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Modal
            animationType="fade"
            transparent={true}
            visible={triesVisible}
            onRequestClose={() => {
              setTriesVisible(!triesVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <Text style={{ fontSize: 16, margin: 16 }}>
                You have reached the maximum amount of tries, please choose one
                of the following to continue
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  setTriesVisible(false);
                  await EncryptedStorage.setItem(
                    "listening_tries",
                    JSON.stringify(3)
                  );
                  setTries(3);
                }}
              >
                <Text style={{ fontSize: 16, color: "white" }}>
                  Watch an ad to try again
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={viewAnswerAdVisible}
            onRequestClose={() => {
              setViewAnswerAdVisible(!viewAnswerAdVisible);
            }}
          >
            <View style={styles.modalContainer}>
              <Text style={{ fontSize: 16, margin: 16 }}>
                Watch an ad to view the answer
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={async () => {
                  setViewAnswerAdVisible(false);
                  setAnswerVisible(true);
                }}
              >
                <Text style={{ fontSize: 16, color: "white" }}>
                  Watch ad to view answer
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setQuestionVisible(!questionVisible);
            }}
          >
            <Text style={{ fontSize: 16, color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
      {!questionVisible && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setQuestionVisible(true);
            setMarksVisible(false);
            setAnswerVisible(false);
            setMarks(0);
          }}
        >
          <Text style={{ fontSize: 24 }}>Start</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  questionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: width,
    paddingHorizontal: 16,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  questionText: {
    fontSize: 16,
    textAlign: "justify",
  },
  checkAnswerButton: {
    borderRadius: 16,
    backgroundColor: Colors.third,
    padding: 16,
    width: width * 0.8,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAnswerButton: {
    borderRadius: 16,
    backgroundColor: "#f58442",
    padding: 16,
    width: width * 0.8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: width * 0.85,
    height: height * 0.95,
    alignSelf: "center",
    marginTop: (height * 0.05) / 2,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: Colors.first,
    borderRadius: 20,
  },
  modalButton: {
    borderRadius: 16,
    backgroundColor: Colors.fourth,
    padding: 16,
    width: width * 0.8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    borderRadius: 16,
    backgroundColor: Colors.fourth,
    padding: 16,
    width: width * 0.8,
    marginTop: 16,
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

export default ListeningScreen;
