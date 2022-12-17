import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import { getUniqueId, getModel } from "react-native-device-info";
import * as RNLocalize from "react-native-localize";
import EncryptedStorage from "react-native-encrypted-storage";

// Colors
import Colors from "../../constants/colors";

// Context
import { Context } from "../../store/context";

// Window size
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const DashboardScreen = () => {
  const navigator = useNavigation();
  const { userID, setUserID } = useContext(Context);
  const deviceModel = getModel();
  const deviceCountry = RNLocalize.getCountry();
  const [purchase, setPurchase] = useState(null);

  const clearEncryptedStorage = async () => {
    try {
      await EncryptedStorage.clear();
      console.log("Storage cleared!");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPurchase = async () => {
    try {
      const purchase = await EncryptedStorage.getItem("purchase");
      if (purchase) {
        setPurchase(purchase === "true");
      } else {
        await EncryptedStorage.setItem("purchase", "false");
        setPurchase(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPurchase();
    // clearEncryptedStorage();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.gameChoiceContainer}
        onPress={() => {
          navigator.navigate("Reading");
        }}
      >
        <Text style={{ fontSize: 24 }}>Reading</Text>
        <Image
          style={{ height: 40, width: 40, marginLeft: 15 }}
          source={require("../../assets/icons/dashboard/glasses-outline.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.gameChoiceContainer}
        onPress={() => {
          navigator.navigate("Listening");
        }}
      >
        <Text style={{ fontSize: 24 }}>Listening</Text>
        <Image
          style={{ height: 40, width: 40, marginLeft: 15 }}
          source={require("../../assets/icons/dashboard/musical-note-outline.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.gameChoiceContainer}
        onPress={() => {
          navigator.navigate("Writing");
        }}
      >
        <Text style={{ fontSize: 24 }}>Writing</Text>

        <Image
          style={{ height: 40, width: 40, marginLeft: 15 }}
          source={require("../../assets/icons/dashboard/pencil-outline.png")}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.gameChoiceContainer}
        onPress={() => {
          navigator.navigate("Speaking");
        }}
      >
        <Text style={{ fontSize: 24 }}>Speaking</Text>
        <Image
          style={{ height: 40, width: 40, marginLeft: 15 }}
          source={require("../../assets/icons/dashboard/chatbubble-ellipses-outline.png")}
        />
      </TouchableOpacity>
      {purchase !== null && !purchase && (
        <TouchableOpacity
          style={[
            styles.gameChoiceContainer,
            { backgroundColor: Colors.fourth },
          ]}
          onPress={async () => {
            Alert.alert(
              "You may enjoy the app without getting interrupted now!"
            );
            getPurchase();
            await EncryptedStorage.setItem("purchase", "true");
            setPurchase(true);
          }}
        >
          <Text style={{ fontSize: 12, color: "white" }}>
            {"Buy (USD 9.99) No ads Unlimited Tries and Checks"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //marginTop: 48,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gameChoiceContainer: {
    width: width * 0.8,
    height: height * 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: Colors.second,
    marginBottom: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    flexDirection: "row",
  },
});

export default DashboardScreen;
