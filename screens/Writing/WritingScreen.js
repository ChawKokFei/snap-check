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
  TextInput,
} from "react-native";
import EncryptedStorage from "react-native-encrypted-storage";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const WritingScreen = () => {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [question1, setQuestion1] = useState("");
  const [question1Check, setQuestion1Check] = useState(null);
  const [question2, setQuestion2] = useState("");
  const [question2Check, setQuestion2Check] = useState(null);
  const [question3, setQuestion3] = useState("");
  const [question3Check, setQuestion3Check] = useState(null);
  const [question4, setQuestion4] = useState("");
  const [question4Check, setQuestion4Check] = useState(null);
  const [tries, setTries] = useState(null);
  const [triesVisible, setTriesVisible] = useState(false);
  const [marks, setMarks] = useState(0);
  const [marksVisible, setMarksVisible] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [viewAnswerAdVisible, setViewAnswerAdVisible] = useState(false);

  const processMarks = async (marks) => {
    console.log("process marks function, number of tries: ", tries);
    console.log("process marks function, marks:", marks);
    try {
      // Points to add
      let points = 0;

      // First save the latest mark
      let readingMarks = JSON.parse(
        await EncryptedStorage.getItem("const_writing_marks")
      );

      if (readingMarks !== null) {
        // update mark only if the mark is higher than the one saved
        if (readingMarks.marks < marks) {
          points = (marks - readingMarks.marks) * 10;
          await EncryptedStorage.setItem(
            "const_writing_marks",
            JSON.stringify({ marks: marks, pointsAdded: false })
          );
        }
      } else {
        points = marks * 10;
        await EncryptedStorage.setItem(
          "const_writing_marks",
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
        JSON.parse(await EncryptedStorage.getItem("const_writing_marks"))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNumberOfTries = async () => {
    try {
      //await EncryptedStorage.clear();
      let value = JSON.parse(await EncryptedStorage.getItem("writing_tries"));
      if (value !== null) {
        //console.log("value not null:", value);
        setTries(value);
      } else {
        //console.log("value null:", value);
        await EncryptedStorage.setItem("writing_tries", JSON.stringify(3));
        setTries(3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deductTries = async () => {
    //await EncryptedStorage.clear();
    try {
      let value = JSON.parse(await EncryptedStorage.getItem("writing_tries"));
      if (value !== null) {
        //console.log("value not null:", value);
        if (value > 0) {
          await EncryptedStorage.setItem(
            "writing_tries",
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
        await EncryptedStorage.setItem("writing_tries", JSON.stringify(3));
        setTries(3);
        checkAnswer();
        ToastAndroid.show("Number of tries left: " + 3, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAnswer = () => {
    setMarks(0);
    let localMarkCount = 0;
    if (question1.toLowerCase().includes("ali saw a snake in the afternoon")) {
      setQuestion1Check(true);
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    } else {
      setQuestion1Check(false);
    }
    if (question2.toLowerCase().includes("abu went to the market yesterday")) {
      setQuestion2Check(true);
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    } else {
      setQuestion2Check(false);
    }
    if (question3.toLowerCase().includes("i'm cleaning the floor now")) {
      setQuestion3Check(true);
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    } else {
      setQuestion3Check(false);
    }
    if (question4.toLowerCase().includes("i called the police last night")) {
      setQuestion4Check(true);
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    } else {
      setQuestion4Check(false);
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
              <Text style={styles.titleText}>
                {"Rearrange the words to form a correct sentence."}
              </Text>
              <View style={styles.sentenceContainer}>
                <Text style={{ fontSize: 16 }}>
                  {"1) Ali | in the afternoon | a snake | saw"}
                </Text>
                <TextInput
                  style={[
                    styles.textInputSmall,
                    question1Check == null
                      ? null
                      : question1Check
                      ? styles.correct
                      : styles.incorrect,
                  ]}
                  placeholder="Enter your answer here"
                  onChangeText={(text) => setQuestion1(text)}
                  value={question1}
                  maxLength={50}
                />
              </View>
              <View style={styles.sentenceContainer}>
                <Text style={{ fontSize: 16 }}>
                  {"2) went | Abu | yesterday | to the market"}
                </Text>
                <TextInput
                  style={[
                    styles.textInputSmall,
                    question2Check == null
                      ? null
                      : question2Check
                      ? styles.correct
                      : styles.incorrect,
                  ]}
                  placeholder="Enter your answer here"
                  onChangeText={(text) => setQuestion2(text)}
                  value={question2}
                  maxLength={50}
                />
              </View>
              <View style={styles.sentenceContainer}>
                <Text style={{ fontSize: 16 }}>
                  {"3) the floor | i'm | now | cleaning"}
                </Text>
                <TextInput
                  style={[
                    styles.textInputSmall,
                    question3Check == null
                      ? null
                      : question3Check
                      ? styles.correct
                      : styles.incorrect,
                  ]}
                  placeholder="Enter your answer here"
                  onChangeText={(text) => setQuestion3(text)}
                  value={question3}
                  maxLength={50}
                />
              </View>
              <View style={styles.sentenceContainer}>
                <Text style={{ fontSize: 16 }}>
                  {"4) the | called | i | police | last night"}
                </Text>
                <TextInput
                  style={[
                    styles.textInputSmall,
                    question4Check == null
                      ? null
                      : question4Check
                      ? styles.correct
                      : styles.incorrect,
                  ]}
                  placeholder="Enter your answer here"
                  onChangeText={(text) => setQuestion4(text)}
                  value={question4}
                  maxLength={50}
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
                    "1) Ali saw a snake in the afternoon.\n2) Abu went to the market yesterday.\n3) I'm cleaning the floor now.\n4) I called the police last night."
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
                    "writing_tries",
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
    textAlign: "center",
  },
  sentenceContainer: {
    width: width * 0.85,
    marginTop: 16,
  },
  textInputSmall: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    width: width * 0.85,
    marginTop: 8,
  },
  correct: {
    borderColor: "green",
  },
  incorrect: {
    borderColor: "red",
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

export default WritingScreen;
