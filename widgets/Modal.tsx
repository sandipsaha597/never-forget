import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  LayoutAnimation,
  Text,
  View,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";
import { AppContext } from "../AppContext/AppContext";

export default function Modal(props: {
  text: string;
  center?: boolean;
  color?: string;
  chatObj?: any;
  scroll?: boolean;
}) {
  const { text, center, color, chatObj, scroll } = props;
  const [chat, setChat] = useState<any>(chatObj);

  useEffect(() => {
    setChat(chatObj);
  }, [text]);

  const {
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);
  const bottomValue = useRef(
    new Animated.Value(center ? Dimensions.get("window").height / 2 - 40 : 0)
  ).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!chatObj) {
      setTimeout(() => {
        Animated.timing(bottomValue, {
          toValue: Dimensions.get("window").height / 2 + 20,
          duration: 400,
          easing: Easing.ease,
        }).start();
        opacityValueFunc();
      }, rewardMsgTimeoutTime);
    }
  }, []);

  useEffect(() => {
    Animated.timing(bottomValue, {
      toValue: center ? Dimensions.get("window").height / 2 : 20,
      duration: 400,
      easing: Easing.ease,
    }).start();

    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 400,
      easing: Easing.ease,
    }).start();
  }, []);

  const reply = (clickedObj: any, i1: number, i2: number) => {
    LayoutAnimation.easeInEaseOut();
    const { id, reply, indent, executeFunction } = clickedObj;
    let tempChat = [...chat];
    tempChat[i1] = tempChat[i1].filter((v: string, i: number) => i === i2);
    tempChat.push([
      {
        id,
        text: reply,
      },
    ]);
    if (indent) {
      tempChat.push(indent);
    }
    setChat(tempChat);

    if (executeFunction) {
      executeFunction();
    }

    if (!!!indent) {
      setTimeout(() => {
        Animated.timing(bottomValue, {
          toValue: 50,
          duration: 400,
          easing: Easing.ease,
        }).start();
        opacityValueFunc();
      }, 2500);
    }
  };

  const opacityValueFunc = () => {
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.ease,
    }).start();
  };

  const scrollViewRef = useRef<any>();
  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: bottomValue,
        alignSelf: center ? "center" : "flex-start",
        borderRadius: center ? 4 : 0,
        opacity: opacityValue,
        margin: 10,
        width: center ? "auto" : "86%",
        overflow: "hidden",
        height: scroll ? "90%" : "auto",
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          backgroundColor: center ? "transparent" : "#fff",
          padding: 10,
        }}
        ref={scrollViewRef}
        onContentSizeChange={(contentWidth, contentHeight) => {
          if (!center) {
            setTimeout(() => {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }, 1000);
          }
        }}
      >
        <View
          style={{
            backgroundColor: color ? color : "#2b2b2b",
            // marginTop: 10,
            padding: 10,
            marginRight: 10,
            borderRadius: 4,
            maxWidth: center ? "100%" : "93%",
          }}
        >
          {text.startsWith("custom") ? (
            text.includes("===the guy above===") ? (
              <Text style={{ color: "#fff" }}>
                The Guy above isn't me. His name is Matty. Their youtube
                channel:
                <OpenURLButton
                  url={
                    "https://www.youtube.com/channel/UCBX_-ls-dXuhFNSWSXcHrTA"
                  }
                >
                  <Text style={{ color: "#fff" }}>Matt &amp; Matty</Text>
                </OpenURLButton>
                {"\n \n"}
                The YouTube video link: {"\n"}
                <OpenURLButton
                  url={"https://www.youtube.com/watch?v=VkPlQ4gjk8M"}
                >
                  <Text style={{ color: "#fff" }}>
                    https://www.youtube.com/watch?v={"\n"}VkPlQ4gjk8M
                  </Text>
                </OpenURLButton>
                {"\n \n"}They explained spaced repetition very well. So did you
                understand what spaced repetition is? It's crucial to use this
                app correctly.
              </Text>
            ) : text.includes("===the guy above hindi===") ? (
              <Text style={{ color: "#fff" }}>
                The Guy above isn't me. His name is Amit Kakkar. His youtube
                channel:
                <OpenURLButton
                  url={
                    "https://www.youtube.com/channel/UCClj0UjhdYaR-WR-RHBVOww"
                  }
                >
                  <Text style={{ color: "#fff" }}>AMIT KAKKAR SPEAKS</Text>
                </OpenURLButton>
                {"\n \n"}
                The YouTube video link: {"\n"}
                <OpenURLButton
                  url={"https://www.youtube.com/watch?v=OccJMq7AtSE"}
                >
                  <Text style={{ color: "#fff" }}>
                    https://www.youtube.com/watch?v={"\n"}OccJMq7AtSE
                  </Text>
                </OpenURLButton>
                {"\n"}
                {"\n"}
                He's a physics - gold medalist, B.tech - gold medalist, M.S. IIT
                delhi - gold medalist
                {"\n \n"}
                He explained spaced repetition very well. So did you understand
                what spaced repetition is? It's crucial to use this app
                correctly.
              </Text>
            ) : null
          ) : (
            <Text
              style={{ textAlign: center ? "center" : "left", color: "#fff" }}
            >
              {text}
            </Text>
          )}
        </View>

        {!!chatObj &&
          chat.map((v: any, i1: number) => {
            const isReply = i1 % 2 === 0;
            return (
              <View
                key={i1}
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: isReply ? "flex-end" : "flex-start",
                  maxWidth: isReply ? "100%" : "93%",
                }}
              >
                {v.map((j: any, i2: number) => (
                  <TouchableOpacity
                    activeOpacity={isReply && i1 === chat.length - 1 ? 0.7 : 1}
                    key={j.id}
                    onPress={() =>
                      isReply && i1 === chat.length - 1 ? reply(j, i1, i2) : {}
                    }
                    style={{
                      backgroundColor: isReply ? "#3178c6" : "#2b2b2b",
                      padding: 10,
                      marginTop: 10,

                      marginLeft: isReply ? 10 : 0,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: isReply ? "#ededed" : "#fff" }}>
                      {j.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
      </ScrollView>
    </Animated.View>
  );
}

const OpenURLButton = (props: { url: string; children: any }) => {
  const { url, children } = props;
  const {
    constants: { externalLinkColor },
  } = useContext<any>(AppContext);

  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Text
          style={{
            // borderColor: externalLinkColor,
            // color: externalLinkColor,
            // borderBottomWidth: 2,
            textDecorationColor: "blue",
            textDecorationLine: "underline",
          }}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
