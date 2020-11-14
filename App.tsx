import "react-native-gesture-handler";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import AllNotes from "./screens/AllNotes";
import {
  AppContext,
  AppProvider,
  EnumSpacedRepetition,
} from "./AppContext/AppContext";
import {
  KnowSpacedRepetition,
  VideoScreen,
} from "./screens/Questions/KnowSpacedRepetition";
import AddNote from "./screens/AddNote";
import Animated, { Easing } from "react-native-reanimated";
import Modal from "./widgets/Modal";

const getFonts = () =>
  Font.loadAsync({
    "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "staatliches-regular": require("./assets/fonts/Staatliches-Regular.ttf"),
  });

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (fontLoaded) {
    return (
      <AppProvider>
        <Main />
      </AppProvider>
    );
  } else {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => setFontLoaded(true)} />
    );
  }
}

const rewardMsgs = [
  "Well Done",
  "Bravo",
  "Keep up the good work",
  "Awesome",
  "Great",
  "Hats off",
  "Way to go",
  "You rock",
  "Nice going",
  "Congrats",
  "Good job",
];
const Main = () => {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const value = useRef(new Animated.Value(-Dimensions.get("window").height))
    .current;
  const isAddNoteOpen = useRef(false);
  const {
    states: { knowSpacedRepetition, allNotes },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);

  const Stack = createStackNavigator();
  const Tabs = createBottomTabNavigator();
  const showAddNote = (toValue: number) => {
    isAddNoteOpen.current = !isAddNoteOpen.current;
    Animated.timing(value, {
      toValue: toValue,
      duration: 300,
      easing: Easing.ease,
    }).start();
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", (e) => {
      if (isAddNoteOpen.current) {
        showAddNote(-Dimensions.get("window").height);
        return true;
      }
    });
  }, []);

  return (
    <>
      <StatusBar style='light' />
      <NavigationContainer>
        {knowSpacedRepetition === EnumSpacedRepetition.No ? (
          <Stack.Navigator>
            <Stack.Screen
              name='KnowSpacedRepetition'
              component={KnowSpacedRepetition}
              options={{ title: "", headerShown: false }}
            />
            <Stack.Screen
              name='VideoScreen'
              component={VideoScreen}
              options={{ title: "" }}
            />
          </Stack.Navigator>
        ) : (
          <>
            <Tabs.Navigator
              initialRouteName={allNotes.length === 0 ? "AllNotes" : "Home"}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName = "";

                  if (route.name === "Home") {
                    iconName = "home";
                    return (
                      <AntDesign name={iconName} size={size} color={color} />
                    );
                  } else if (route.name === "AllNotes") {
                    iconName = "bars";
                    return (
                      <AntDesign name={iconName} size={size} color={color} />
                    );
                  } else if (route.name === "KnowSpacedRepetition") {
                    iconName = "bars";
                    return (
                      <AntDesign name={iconName} size={size} color={color} />
                    );
                  }
                },
              })}
              tabBarOptions={{
                activeTintColor: "#3178c6",
                inactiveTintColor: "gray",
                showLabel: false,
              }}
            >
              <Tabs.Screen name='Home' component={Home} />
              <Tabs.Screen name='AllNotes' component={AllNotes} />
            </Tabs.Navigator>

            <View
              style={{
                borderRadius: 50,
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: [{ translateX: -28 }],
              }}
            >
              <TouchableOpacity onPress={() => showAddNote(0)}>
                <Ionicons name='ios-add-circle' size={70} color='#3178c6' />
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "red" }}>
              {rewardMsgShow && (
                <>
                  {console.log(
                    rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)]
                  )}
                  <Modal
                    text={
                      rewardMsgs[
                        Math.floor(Math.random() * rewardMsgs.length)
                      ] + "!"
                    }
                    noChat
                    center
                    color='#3178c6'
                  />
                </>
              )}
            </View>
            <AddNote
              value={value}
              showAddNote={showAddNote}
              noteAdded={() => {
                setRewardMsgShow(true);
                setTimeout(() => {
                  setRewardMsgShow(false);
                }, rewardMsgTimeoutTime + 500);
              }}
            />
          </>
        )}
      </NavigationContainer>
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headingText: {
    fontSize: 38,
    textAlign: "center",
    fontFamily: "staatliches-regular",
  },
});

{
  /* <KnowSpacedRepetition /> */
}
