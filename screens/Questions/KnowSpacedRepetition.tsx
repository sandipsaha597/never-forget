import { createStackNavigator } from "@react-navigation/stack";
import { add, format } from "date-fns";
import React, { useContext, useState } from "react";
import { Button, Dimensions, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import WebView from "react-native-webview";
import { styles } from "../../App";
import { AppContext, EnumSpacedRepetition } from "../../AppContext/AppContext";
import Dropdown from "../../widgets/Dropdown";
import Modal from "../../widgets/Modal";

export function KnowSpacedRepetition({ navigation }: any) {
  const {
    actions: { setKnowSpacedRepetition },
  } = useContext<any>(AppContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.headingText}>
        Do you know what is spaced repetition?
      </Text>
      <View
        style={{
          flexDirection: "row",
          width: "60%",
          marginTop: 20,
          justifyContent: "space-around",
        }}
      >
        <Button
          title='No, what is it?'
          onPress={() => navigation.navigate("VideoScreen")}
        />
        <Button
          title='Yes'
          onPress={() => {
            setKnowSpacedRepetition(EnumSpacedRepetition.Yes);
          }}
        />
      </View>
    </View>
  );
}

export const VideoScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState("English");
  const [text, setText] = useState("custom===the guy above===");

  const {
    actions: { setKnowSpacedRepetition },
  } = useContext<any>(AppContext);
  const chatObj = [
    [
      {
        id: "7194853255",
        text: "Yes, I get it.",
        reply: "Excellent",
        executeFunction: () => {
          setTimeout(() => {
            setKnowSpacedRepetition(true);
          }, 1500);
        },
      },
      {
        id: "8193959100",
        text: "No, please explain",
        reply: `It's basically a way of revising effectively. If you study\
 something today and don't revise it, you will forget almost\
 everything within a week or so(photographic memory excluded).\
 Which means all of your hard work, time, energy is wasted.\n\
To prevent this we can use space repetition technique. In this\
 amazing technique we revise whatever we wanna remember in a\
 spaced manner. Suppose today ${format(
   new Date(),
   "dd-MMM-yyyy"
 )} you studied something so you will \
 revise it tomorrow (${format(add(new Date(), { days: 1 }), "dd-MMM-yyyy")}),\
 then after 7 days (${format(
   add(new Date(), { days: 7 }),
   "dd-MMM-yyyy"
 )}), then after 30 days (${format(
          add(new Date(), { days: 30 }),
          "dd-MMM-yyyy"
        )})\
 then after 90 days (${format(add(new Date(), { days: 90 }), "dd-MMM-yyyy")}),\
 then after 365 days (${format(
   add(new Date(), { days: 365 }),
   "dd-MMM-yyyy"
 )}). The pattern here was 1-7-30-90-365. There are other famous patterns like 1-3-7-30-90, 1-3-7-15-30-90 etc as well.\
 Like this the information will store in your long term memory, it will become very easy for you to recall and you will Never Forget what's important for you.\n\
So did you understand what spaced repetition is? It's crucial to use this app correctly.`,
        indent: [
          {
            id: "7194853010",
            text: "Yes",
            reply: "Excellent",
            executeFunction: () => {
              setTimeout(() => {
                setKnowSpacedRepetition(true);
              }, 1500);
            },
          },
          {
            id: "7194873955",
            text: "No",
            reply:
              "Please try searching for 'Forgetting curve', 'spaced repetition' and/or 'spacing effect'. Done? So did you\
understand what spaced repetition is? It's crucial to use this\
app correctly.",
            indent: [
              {
                id: "9284719402",
                text: "Yes",
                reply: "Excellent",
                executeFunction: () => {
                  setTimeout(() => {
                    setKnowSpacedRepetition(true);
                  }, 1500);
                },
              },
              {
                id: "3135616781",
                text: "No",
                reply:
                  "🤔 🤔 I don't know how else to explain. But no issues come inside.",
                indent: [
                  {
                    id: "9284719402",
                    text: "🚀",
                    reply: "🚀",
                    executeFunction: () => {
                      setTimeout(() => {
                        setKnowSpacedRepetition(true);
                      }, 1500);
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  ];
  return (
    <>
      {selected === "English" ? <Video /> : <VideoHindi />}
      <View
        style={{
          backgroundColor: "#fff",
          paddingLeft: 15,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Dropdown
          title='Switch video language'
          selected={selected}
          setSelected={(val) => {
            setSelected(val);
            // if (val === "English") {
            //   setText("custom===the guy above===");
            // } else {
            //   setText("custom===the guy above hindi===");
            // }
          }}
          options={[
            { id: "3413449123", title: "English" },
            { id: "3489124389", title: "Hindi" },
          ]}
        />
      </View>
      <View
        style={{
          flex: 1,
          overflow: "hidden",
          // marginTop: 10,
        }}
      >
        {/* <Text>
          The Guy above isn't me. His name is Matty. Their youtube channel:
          https://www.youtube.com/channel/UCBX_-ls-dXuhFNSWSXcHrTA The YouTube
          video link: https://www.youtube.com/watch?v=VkPlQ4gjk8M They explained
          spaced repetition very well.
        </Text>
        <Text>I get it</Text>
        <Text>I didn't understand</Text>
        <Text>I don't understand this language</Text>
        <Text>
        It's basically a way of revising effectively. If you study something
        today and don't revise it, you will forget almost everything within a
        week or so(photographic memory excluded). It means all of your hard
        work, time, energy is wasted. It's called forgetting curve.
      </Text> */}
        {selected === "English" ? (
          <Modal text='custom===the guy above===' chatObj={chatObj} scroll />
        ) : (
          // <Text>hello</Text>
          // <Text>hi</Text>
          <Modal
            text='custom===the guy above hindi==='
            chatObj={chatObj}
            scroll
          />
        )}
      </View>
    </>
  );
};

const Video = () => {
  return (
    <WebView
      source={{ uri: "https://sandipsaha597.github.io/never-forget-iframes/" }}
      style={{ flex: 0, height: Dimensions.get("window").width / 1.78 }}
      containerStyle={{ flex: 0 }}
    />
  );
};
const VideoHindi = () => {
  return (
    <WebView
      source={{
        uri:
          "https://sandipsaha597.github.io/never-forget-iframes/spaced-repetition-in-hindi.html",
      }}
      style={{ flex: 0, height: Dimensions.get("window").width / 1.78 }}
      containerStyle={{ flex: 0 }}
    />
  );
};
