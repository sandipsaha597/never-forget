import "react-native-gesture-handler";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
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
import Settings from "./screens/Settings";
import * as Notifications from "expo-notifications";
import { add, differenceInSeconds, startOfDay } from "date-fns";

const getFonts = () =>
  Font.loadAsync({
    "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "staatliches-regular": require("./assets/fonts/Staatliches-Regular.ttf"),
  });

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  // if (fontLoaded) {
  return (
    <AppProvider>
      {fontLoaded ? (
        <Main />
      ) : (
        <View>
          <AppLoading
            startAsync={getFonts}
            onFinish={() => setFontLoaded(true)}
          />
        </View>
      )}
    </AppProvider>
  );
  // } else {
  //   return (
  //     <View>
  //       <AppLoading
  //         startAsync={getFonts}
  //         onFinish={() => setFontLoaded(true)}
  //       />
  //       {/* <Text>hello world!</Text> */}
  //     </View>
  //   );
  // }
}

export const rewardMsgs = [
  "Well Done! 👍",
  "Bravo! 🌟",
  "Keep up the good work! 🔥",
  "Awesome! 👍",
  "Great! 🌟",
  "Hats off! 👍",
  "Way to go! 🚀",
  "You rock! 🎸",
  "Nice going! 🚶",
  "Good job! 💼",
];
// "Congrats",

const Main = () => {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const [editNoteNumber, setEditNoteNumber] = useState(-1);
  const value = useRef(new Animated.Value(-Dimensions.get("window").height))
    .current;
  const isAddNoteOpen = useRef(false);
  const {
    states: { knowSpacedRepetition, allNotes, isAnyNoteActive },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);

  const Stack = createStackNavigator();
  const Tabs = createBottomTabNavigator();

  useEffect(() => {
    if (!isAnyNoteActive) {
      setTimeout(() => {
        showAddNote(0);
      }, 1000);
    }
  }, [knowSpacedRepetition]);

  useEffect(() => {
    if (isAnyNoteActive) {
      Notifications.cancelScheduledNotificationAsync("SS-EmptyNoteBox");
    } else {
      const trigger = differenceInSeconds(
        add(startOfDay(new Date()), { days: 1, hours: 6 }),
        new Date()
      );
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Your Note box is empty 📁",
          body: "Add notes so you Never Forget what's important to you!",
        },
        identifier: "SS-EmptyNoteBox",
        trigger: { seconds: trigger },
      });
    }
  }, [isAnyNoteActive]);

  const showAddNote = (toValue: number, editNoteNumber?: number) => {
    isAddNoteOpen.current = !isAddNoteOpen.current;
    if (editNoteNumber || editNoteNumber === 0) {
      setEditNoteNumber(editNoteNumber);
    }
    Animated.timing(value, {
      toValue: toValue,
      duration: 300,
      easing: Easing.ease,
    }).start();
  };

  return (
    <>
      <StatusBar style='light' />
      {/* <NavigationContainer>
        <Drawer.Navigator initialRouteName='Home'>
          <Drawer.Screen name='Home' component={Home} />
          <Drawer.Screen name='AllNotes' component={AllNotes} />
        </Drawer.Navigator>
      </NavigationContainer> */}
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
                  } else if (route.name === "Settings") {
                    iconName = "setting";
                    return (
                      <AntDesign name={iconName} size={size} color={color} />
                    );
                  }
                  // else if (route.name === "KnowSpacedRepetition") {
                  //   iconName = "bars";
                  //   return (
                  //     <AntDesign name={iconName} size={size} color={color} />
                  //   );
                  // }
                },
              })}
              tabBarOptions={{
                activeTintColor: "#3178c6",
                inactiveTintColor: "gray",
                showLabel: false,
              }}
            >
              <Tabs.Screen
                name='Home'
                children={() => <Home showAddNote={showAddNote} />}
              />
              <Tabs.Screen
                name='AllNotes'
                children={() => <AllNotes showAddNote={showAddNote} />}
              />
              <Tabs.Screen name='Settings' component={Settings} />
            </Tabs.Navigator>

            {/* <View
              style={{
                borderRadius: 50,
                position: "absolute",
                bottom: 50,
                right: 10,
                // transform: [{ translateX: -28 }],
              }}
            >
              <TouchableOpacity onPress={() => showAddNote(0)}>
                <Ionicons name='ios-add-circle' size={70} color='#3178c6' />
              </TouchableOpacity>
            </View> */}
            {rewardMsgShow && (
              <Modal
                text={rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)]}
                noChat
                center
                color='#3178c6'
              />
            )}
            <AddNote
              isAddNoteOpen={isAddNoteOpen}
              editNoteNumber={editNoteNumber}
              setEditNoteNumber={setEditNoteNumber}
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
