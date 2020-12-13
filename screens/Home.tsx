import {
  add,
  differenceInDays,
  format,
  isBefore,
  isEqual,
  isFuture,
  isSameDay,
  sub,
} from "date-fns";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  LayoutAnimation,
  NativeModules,
  Platform,
  Text,
  View,
} from "react-native";
import {
  FlatList,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { AppContext, IAllNotes } from "../AppContext/AppContext";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import Modal from "../widgets/Modal";

const { UIManager } = NativeModules;
const congratsIcons = [
  require("../assets/icons/fire-cracker256.png"),
  require("../assets/icons/fireworks.png"),
  require("../assets/icons/trophy.png"),
  require("../assets/icons/clapping.png"),
];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const date = { active: false, days: 1, hours: 0 };
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
  "Good job",
];
// "Congrats",

export default function Home() {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const [notesToRevise, setNotesToRevise] = useState<boolean>(true);
  const currentRewardMsg = useRef("Well done");
  const [rewardIcon, setRewardIcon] = useState(null);

  useEffect(() => {
    currentRewardMsg.current =
      rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)];
  }, []);

  const {
    states: { allNotes, isAnyNoteActive },
    actions: { setAllNotes },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);

  useEffect(() => {
    // LayoutAnimation.easeInEaseOut();
    const haveNotesToRevise = allNotes.find((v: any) => {
      return (
        !v.delete &&
        !isFuture(
          sub(new Date(v.revisions[v.revisionNumber + 1]), {
            days: date.days,
            hours: date.hours,
          })
        )
      );
    });
    setNotesToRevise(!!haveNotesToRevise);
  }, [allNotes]);

  useEffect(() => {
    if (!notesToRevise) {
      setRewardIcon(
        congratsIcons[Math.floor(Math.random() * congratsIcons.length)]
      );
    }
  }, [notesToRevise]);

  const markAsRevised = (itemIndex: number, id: string) => {
    const tempAllNotes = [...allNotes];
    // let index = undefined;
    // tempAllNotes.find((v, i) => {
    //   if (v.id === id) {
    //     index = i;
    //   }
    //   return v.id === id;
    // });

    setRewardMsgShow(true);

    setTimeout(() => {
      tempAllNotes[itemIndex].revisionNumber += 1;
      setAllNotes(tempAllNotes);
      setTimeout(() => {
        currentRewardMsg.current =
          rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)];
        setRewardMsgShow(false);
      }, rewardMsgTimeoutTime + 500);
    }, 10);
  };

  const skip = (itemIndex: number) => {
    const tempAllNotes = [...allNotes];
    // let index = undefined;
    // tempAllNotes.find((v, i) => {
    //   if (v.id === id) {
    //     index = i;
    //   }
    //   return v.id === id;
    // });

    // tempAllNotes[index as any].revisions.splice(
    //   tempAllNotes[index as any].revisionNumber + 1,
    //   1
    // );
    tempAllNotes[itemIndex].revisions.splice(
      tempAllNotes[itemIndex].revisionNumber + 1,
      1
    );
    setAllNotes(tempAllNotes);
  };

  return isAnyNoteActive && allNotes.length !== 0 ? (
    <View style={{ backgroundColor: "#fff", flex: 1, padding: 10 }}>
      {date.active && (
        <>
          <Text>
            {JSON.stringify(
              sub(new Date(), {
                days: date.days,
                hours: date.hours,
              })
            )}
          </Text>
          <Text>{JSON.stringify(new Date())}</Text>
        </>
      )}
      {notesToRevise ? (
        <FlatList
          data={allNotes}
          renderItem={({ item, index }: any) => {
            return !item.delete &&
              !isFuture(
                sub(new Date(item.revisions[item.revisionNumber + 1]), {
                  days: date.days,
                  hours: date.hours,
                })
              ) ? (
              <ReviewBox
                itemIndex={index}
                disabled={rewardMsgShow}
                note={item as IAllNotes}
                markAsRevised={markAsRevised}
                skip={skip}
              />
            ) : null;
          }}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View
          style={{
            height: Dimensions.get("window").height - 80,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: "50%",
              height: Dimensions.get("window").width / 2.1,
            }}
            source={rewardIcon}
          />
          <Text
            style={{
              fontSize: 26,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Congrats! You have done all your revisions on time!
          </Text>
        </View>
      )}

      {rewardMsgShow && (
        <Modal
          text={currentRewardMsg.current + "!"}
          noChat
          center
          color='#3178c6'
        />
      )}
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      {/* <AntDesign
        name='folderopen'
        style={{ opacity: 0.5 }}
        size={150}
        color='black'
      /> */}
      <Image
        style={{ width: "50%", height: Dimensions.get("window").width / 2.1 }}
        source={require("../assets/icons/box.png")}
      />
      <Text>No Notes yet</Text>
    </View>
  );
}

const ReviewBox = (props: {
  note: IAllNotes;
  markAsRevised: (itemIndex: number, id: string) => void;
  skip: (itemIndex: number, id: string) => void;
  disabled: boolean;
  itemIndex: any;
}) => {
  const { note, markAsRevised, skip, disabled, itemIndex } = props;
  const differenceInDaysConst = differenceInDays(
    new Date(),
    sub(new Date(note.revisions[note.revisionNumber + 1]), {
      days: date.days,
      hours: date.hours,
    })
  );
  return (
    <View
      style={{
        margin: 10,
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>
        {itemIndex} {note.title}
      </Text>
      {differenceInDaysConst > 0 ? (
        <Text
          style={{
            marginBottom: 3,
            includeFontPadding: false,
            color: "#e74c3c",
          }}
        >
          {differenceInDaysConst} {differenceInDaysConst > 1 ? "days" : "day"}{" "}
          ago
        </Text>
      ) : null}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        {note.subject !== "--None--" && (
          <Text
            style={{
              borderRadius: 50,
              backgroundColor: "#b2bec3",
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginRight: 10,
            }}
          >
            {note.subject}
          </Text>
        )}
        <FontAwesome name='repeat' size={24} color='black' />
        <Text style={{ fontSize: 16, marginLeft: 4 }}>
          {note.revisionNumber}
        </Text>
      </View>
      {note.desc.trim() !== "" && (
        <Text
          style={{ fontSize: 20, marginBottom: 10, includeFontPadding: false }}
        >
          {note.desc}
        </Text>
      )}
      <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
        <TouchableNativeFeedback
          style={{
            backgroundColor: disabled ? "#34495e" : "#e74c3c",
            marginRight: 15,
            paddingLeft: 10,
          }}
          disabled={disabled}
          onPress={() => skip(itemIndex, note.id)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Skip</Text>
            {/* <Image source={require("../assets/icons/draw-check-mark.png")} /> */}
            <Image source={require("../assets/icons/right-arrow.png")} />
            {/* <Image source={require("../assets/icons/draw-check-mark.png")} /> */}
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          disabled={disabled}
          onPress={() => markAsRevised(itemIndex, note.id)}
        >
          {/* <Text style={{marginRight: 10, fontSize: 20}} >Mark as read</Text> */}
          <Image source={require("../assets/icons/draw-check-mark.png")} />
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};
