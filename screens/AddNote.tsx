import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, Text, View } from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import Animated, { abs, Value } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "../App";
import { AppContext } from "../AppContext/AppContext";
import Dropdown from "../widgets/Dropdown";
import { add, startOfDay } from "date-fns/esm";
import { v4 as uuidv4 } from "uuid";
import Modal from "../widgets/Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const chatObj = [
  [
    {
      id: "8899854728",
      text: "That's great!",
      reply: "I know",
    },
    {
      id: "7194853255",
      text: "Thanks!",
      reply: "You're welcome",
    }
  ],
];
export default function AddNote(props: {
  value: any;
  showAddNote: (val: number) => void;
  noteAdded: () => void;
}) {
  const { value, showAddNote, noteAdded } = props;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [firstNote, setFirstNote] = useState(true);

  const {
    states: { subs, allNotes },
    actions: { setAllNotes },
    constants: {mainColor}
  } = useContext<any>(AppContext);
  const [selected, setSelected] = useState(subs[0].title);

  const addNote = () => {
    let allRevisions = [startOfDay(new Date())];
    allRevisions.push(add(startOfDay(new Date()), { days: 1 }));
    allRevisions.push(add(startOfDay(new Date()), { weeks: 1 }));
    allRevisions.push(add(startOfDay(new Date()), { months: 1 }));
    allRevisions.push(add(startOfDay(new Date()), { months: 3 }));

    const tempAllNotes = [...allNotes];
    tempAllNotes.unshift({
      id: uuidv4(),
      title,
      desc,
      subject: selected,
      revisions: allRevisions,
      revisionNumber: 0,
    });
    setAllNotes(tempAllNotes);
    Keyboard.dismiss();
    noteAdded();
    setTimeout(() => {
      setTitle("");
      setDesc("");
    }, 1000);
  };
  // AsyncStorage.removeItem("firstNote");

  const setItem = async (toSet: any, itemName: string) => {
    const value = await AsyncStorage.getItem(itemName);
    if (value !== "false") {
      toSet(true);
    } else {
      toSet(false);
    }
  };

  useEffect(() => {
    setItem(setFirstNote, "firstNote");
  }, []);

  return (
    <Animated.View
      style={{
        backgroundColor: mainColor,
        position: "absolute",
        bottom: value,
        height: "100%",
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          position: "relative",
          top: 0,
          width: "100%",
          zIndex: 100,
          backgroundColor: "#3178c6",
        }}
      >
        <TouchableNativeFeedback
          style={{ padding: 10 }}
          onPress={() => {
            showAddNote(-Dimensions.get("window").height);
            Keyboard.dismiss();
          }}
        >
          <MaterialIcons name='arrow-back' size={24} color='white' />
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          style={{ padding: 10, opacity: title.trim() === "" ? 0.4 : 1 }}
          disabled={title.trim() === "" ? true : false}
          onPress={() => {
            showAddNote(-Dimensions.get("window").height);
            addNote();
          }}
        >
          <AntDesign name='check' size={24} color='white' />
        </TouchableNativeFeedback>
      </View>
      <ScrollView style={{ paddingHorizontal: 10, marginBottom: 10, flex: 1 }}>
        <View
          style={{
            minHeight: 500,
          }}
        >
          <Text style={[styles.headingText, { color: "white", marginTop: 0 }]}>
            What you learned today?
          </Text>
          <TextInput
            style={{
              minHeight: 40,
              maxHeight: 100,
              borderColor: "black",
              borderBottomWidth: 1,
              fontSize: 20,
            }}
            underlineColorAndroid='#3178c6'
            selectionColor={"#fff"}
            onChangeText={(val) => setTitle(val)}
            placeholder='Title'
            multiline
            value={title}
          />
          <Dropdown
            title='Subject'
            options={subs}
            selected={selected}
            setSelected={setSelected}
            deleteAble
          />
          <TextInput
            style={{
              minHeight: 90,
              borderColor: "black",
              borderBottomWidth: 1,
              fontSize: 20,
            }}
            underlineColorAndroid='#3178c6'
            selectionColor={"#fff"}
            onChangeText={(val) => setDesc(val)}
            placeholder='Description(optional)...'
            multiline
            value={desc}
            maxLength={400}
          />
          <Text style={{ textAlign: "right" }}>{desc.length}/400</Text>
        </View>
      </ScrollView>
      {firstNote && (
        <Modal
          text="I'll remind you to revise it. So you Never Forget what's important to you."
          chatObj={chatObj}
          // reply={reply}
        />
      )}
    </Animated.View>
  );
}
