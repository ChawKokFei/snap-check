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
import EncryptedStorage from "react-native-encrypted-storage";

// Components
import Question from "./Question";

// Colors
import Colors from "../../constants/colors";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const QUESTIONS = {
  title: "My Lovely Family",
  text: "I live in a mansion near the city. I have a younger brother and an elder sister. My brother likes to drink coconut milk. He is talkative and handsome. He likes to play basketball. My sister is an introvert. She seldoms initiate conversation. I like my brother and sister. I take good care of them.\n\nMy mother is a nurse. My father is an chemical engineer. We live happily together",
};

const ReadingScreen = () => {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [answer, setAnswer] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  });
  const [marksVisible, setMarksVisible] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [triesVisible, setTriesVisible] = useState(false);
  const [viewAnswerAdVisible, setViewAnswerAdVisible] = useState(false);
  const [tries, setTries] = useState(null);
  const [marks, setMarks] = useState(0);

  const processMarks = async (marks) => {
    console.log("process marks function, number of tries: ", tries);
    console.log("process marks function, marks:", marks);
    try {
      // Points to add
      let points = 0;

      // First save the latest mark
      let readingMarks = JSON.parse(
        await EncryptedStorage.getItem("const_reading_marks")
      );

      if (readingMarks !== null) {
        // update mark only if the mark is higher than the one saved
        if (readingMarks.marks < marks) {
          points = (marks - readingMarks.marks) * 10;
          await EncryptedStorage.setItem(
            "const_reading_marks",
            JSON.stringify({ marks: marks, pointsAdded: false })
          );
        }
      } else {
        points = marks * 10;
        await EncryptedStorage.setItem(
          "const_reading_marks",
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
        JSON.parse(await EncryptedStorage.getItem("const_reading_marks"))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getNumberOfTries = async () => {
    try {
      //await EncryptedStorage.clear();
      let value = JSON.parse(await EncryptedStorage.getItem("reading_tries"));
      if (value !== null) {
        //console.log("value not null:", value);
        setTries(value);
      } else {
        //console.log("value null:", value);
        await EncryptedStorage.setItem("reading_tries", JSON.stringify(3));
        setTries(3);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deductTries = async () => {
    //await EncryptedStorage.clear();
    try {
      let value = JSON.parse(await EncryptedStorage.getItem("reading_tries"));
      if (value !== null) {
        //console.log("value not null:", value);
        if (value > 0) {
          await EncryptedStorage.setItem(
            "reading_tries",
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
        await EncryptedStorage.setItem("reading_tries", JSON.stringify(3));
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
    if (answer[1] == "1") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[2] == "4") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[3] == "3") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[4] == "2") {
      console.log("hit 1");
      localMarkCount += 1;
      setMarks((prev) => {
        prev += 1;
        return prev;
      });
    }
    if (answer[5] == "4") {
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
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <ScrollView>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-start",
                width: width,
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginVertical: 16 }}
              >
                {QUESTIONS.title}
              </Text>
              <View style={{ width: width * 0.85 }}>
                <Text style={{ fontSize: 16, textAlign: "justify" }}>
                  {QUESTIONS.text}
                </Text>
                <Question
                  questionNo={1}
                  setAnswer={setAnswer}
                  qna={{
                    question: "1) My mother is a...",
                    answers: {
                      1: "Nurse",
                      2: "Singer",
                      3: "Dancer",
                      4: "Dentist",
                    },
                  }}
                />
                <Question
                  questionNo={2}
                  setAnswer={setAnswer}
                  qna={{
                    question: "2) My house is near the...",
                    answers: {
                      1: "River",
                      2: "Subway",
                      3: "Cave",
                      4: "City",
                    },
                  }}
                />
                <Question
                  questionNo={3}
                  setAnswer={setAnswer}
                  qna={{
                    question: "3) My father is a/an...",
                    answers: {
                      1: "Pilot",
                      2: "Teacher",
                      3: "Engineer",
                      4: "Doctor",
                    },
                  }}
                />
                <Question
                  questionNo={4}
                  setAnswer={setAnswer}
                  qna={{
                    question: "4) My sister is a/an...",
                    answers: {
                      1: "Extrovert",
                      2: "Introvert",
                      3: "Pessimist",
                      4: "Optimist",
                    },
                  }}
                />
                <Question
                  questionNo={5}
                  setAnswer={setAnswer}
                  qna={{
                    question: "5) My brother is talkative and...",
                    answers: {
                      1: "Shy",
                      2: "Quiet",
                      3: "Loud",
                      4: "Handsome",
                    },
                  }}
                />
              </View>
              {marksVisible && (
                <Text style={{ fontSize: 24, marginTop: 16, marginBottom: 8 }}>
                  Your marks: {marks}/5
                </Text>
              )}
              <TouchableOpacity
                style={{
                  borderRadius: 16,
                  backgroundColor: Colors.third,
                  padding: 16,
                  width: width * 0.8,
                  marginVertical: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
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
                  {"1) Nurse\n2) City\n3) Engineer\n4) Introvert\n5) Handsome"}
                </Text>
              )}
              <TouchableOpacity
                style={{
                  borderRadius: 16,
                  backgroundColor: "#f58442",
                  padding: 16,
                  width: width * 0.8,
                  marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
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
                You have reached the maximum amount of tries, please choose one
                of the following to continue
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
                  setTriesVisible(false);
                  await EncryptedStorage.setItem(
                    "reading_tries",
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
                Watch an ad to view the answer
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
              setQuestionVisible(!setQuestionVisible);
              setMarksVisible(false);
              setAnswerVisible(false);
              setMarks(0);
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
  startButton: {
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: Colors.second,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReadingScreen;
