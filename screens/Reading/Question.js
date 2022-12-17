import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Colors
import Colors from "../../constants/colors";

const ButtonQuestion = (props) => {
  return (
    <TouchableOpacity
      style={[
        {
          width: "40%",
          padding: 16,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          margin: 8,
        },
        props.selection == props.number
          ? { backgroundColor: Colors.third }
          : { backgroundColor: Colors.second },
      ]}
      onPress={props.onPress}
    >
      <Text style={{ fontSize: 16 }}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const Question = (props) => {
  const data = props.qna;
  const [selection, setSelection] = useState(null);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, marginTop: 16, marginBottom: 8 }}>
        {data.question}
      </Text>
      <View
        style={{
          flex: 1,
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <ButtonQuestion
          number={1}
          selection={selection}
          onPress={() => {
            setSelection(1);
            props.setAnswer((prev) => {
              prev[props.questionNo] = "1";
              return prev;
            });
          }}
        >
          {data.answers[1]}
        </ButtonQuestion>
        <ButtonQuestion
          number={2}
          selection={selection}
          onPress={() => {
            setSelection(2);
            props.setAnswer((prev) => {
              prev[props.questionNo] = "2";
              return prev;
            });
          }}
        >
          {data.answers[2]}
        </ButtonQuestion>
        <ButtonQuestion
          number={3}
          selection={selection}
          onPress={() => {
            setSelection(3);
            props.setAnswer((prev) => {
              prev[props.questionNo] = "3";
              return prev;
            });
          }}
        >
          {data.answers[3]}
        </ButtonQuestion>
        <ButtonQuestion
          number={4}
          selection={selection}
          onPress={() => {
            setSelection(4);
            props.setAnswer((prev) => {
              prev[props.questionNo] = "4";
              return prev;
            });
          }}
        >
          {data.answers[4]}
        </ButtonQuestion>
      </View>
    </View>
  );
};

export default Question;
