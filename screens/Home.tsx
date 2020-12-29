import { differenceInDays, isFuture, sub } from "date-fns";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeModules,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FlatList,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { AppContext, IAllNotes } from "../AppContext/AppContext";

import Modal from "../widgets/Modal";
import { AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";
import { rewardMsgs } from "../App";

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

// "Congrats",

export default function Home(props: { showAddNote: (value: number) => void }) {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const [notesToRevise, setNotesToRevise] = useState<boolean>(true);
  const currentRewardMsg = useRef("Well done");
  const [rewardIcon, setRewardIcon] = useState(null);
  const { showAddNote } = props;

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

  const showAd = async () => {
    await AdMobInterstitial.setAdUnitID(
      "ca-app-pub-3940256099942544/1033173712"
    ); // Test ID, Replace with your-admob-unit-id
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    setTimeout(async () => {
      await AdMobInterstitial.showAdAsync();
    }, 12000);
  };

  const showAd2 = async () => {
    await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917"); // Test ID, Replace with your-admob-unit-id
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
    // setTimeout( async () => {
    // }, 2000);
  };

  useEffect(() => {
    // showAd();
    // showAd2();
  }, []);

  return (
    <>
      {isAnyNoteActive && allNotes.length !== 0 ? (
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
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
              contentContainerStyle={{ paddingBottom: 60 }}
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
              keyExtractor={(item: any) => item.id}
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
              text={currentRewardMsg.current}
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
          <Image
            style={{
              width: "50%",
              height: Dimensions.get("window").width / 2.1,
            }}
            source={require("../assets/icons/box.png")}
          />
          <Text>No Notes yet</Text>
        </View>
      )}
      <View
        style={{
          borderRadius: 50,
          position: "absolute",
          bottom: 0,
          right: 10,
          // transform: [{ translateX: -28 }],
        }}
      >
        <TouchableOpacity onPress={() => showAddNote(0)}>
          <Ionicons name='ios-add-circle' size={70} color='#3178c6' />
        </TouchableOpacity>
      </View>
    </>
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
        borderRadius: 10
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
        <View style={{ marginRight: 15 }}>
          <TouchableNativeFeedback
            style={{
              backgroundColor: disabled ? "#34495e" : "#e74c3c",
              paddingLeft: 10,
            }}
            disabled={disabled}
            onPress={() => skip(itemIndex, note.id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "#ededed" }}>Skip</Text>
              {/* <Image source={require("../assets/icons/draw-check-mark.png")} /> */}
              <Image source={require("../assets/icons/right-arrow.png")} />
              {/* <Image source={require("../assets/icons/draw-check-mark.png")} /> */}
            </View>
          </TouchableNativeFeedback>
        </View>
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
