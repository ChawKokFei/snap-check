import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import RankingItem from "./RankingItem";
import { getModel } from "react-native-device-info";

// Context
import { Context } from "../../store/context";

const LeaderboardScreen = () => {
  const { getPoints } = useContext(Context);
  // const [points, setPoints] = useState(null);
  const [diamondList, setDiamondList] = useState(null);
  const [goldList, setGoldList] = useState(null);
  const [silverList, setSilverList] = useState(null);
  const [bronzeList, setBronzeList] = useState(null);
  const isFocused = useIsFocused();
  const name = getModel();

  useEffect(() => {
    if (isFocused) {
      getPoints().then((res) => {
        //setPoints(res);
        const tempArr = [{ name: name, points: res }];
        if (res <= 40) {
          console.log("set bronze");
          setBronzeList(tempArr);
          setSilverList(null);
          setGoldList(null);
          setDiamondList(null);
        } else if (res <= 80) {
          console.log("set silver");
          setSilverList(tempArr);
          setBronzeList(null);
          setGoldList(null);
          setDiamondList(null);
        } else if (res <= 120) {
          console.log("set gold");
          setGoldList(tempArr);
          setSilverList(null);
          setBronzeList(null);
          setDiamondList(null);
        } else {
          console.log("set diamond");
          setDiamondList(tempArr);
          setGoldList(null);
          setSilverList(null);
          setBronzeList(null);
        }
      });
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <RankingItem title={"Diamond (PT > 120)"} nameList={diamondList} />
        <RankingItem title={"Gold (80 < PT <= 120)"} nameList={goldList} />
        <RankingItem title={"Silver (40 < PT <= 80)"} nameList={silverList} />
        <RankingItem title={"Bronze (0 < PT <= 40)"} nameList={bronzeList} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    marginBottom: 65,
  },
});

export default LeaderboardScreen;
