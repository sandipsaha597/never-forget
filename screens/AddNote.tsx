import React, { useContext, useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, Keyboard, Text, View } from "react-native";
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
import { isAnyNoteActiveFunc } from "../util/util";

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
    },
  ],
];
export default function AddNote(props: {
  isAddNoteOpen: any;
  value: any;
  editNoteNumber: number;
  setEditNoteNumber: (index: number) => void;
  showAddNote: (val: number) => void;
  noteAdded: () => void;
}) {
  const {
    isAddNoteOpen,
    value,
    editNoteNumber,
    setEditNoteNumber,
    showAddNote,
    noteAdded,
  } = props;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [firstNote, setFirstNote] = useState(true);

  const {
    states: { subs, allNotes },
    actions: { setAllNotes, setIsAnyNoteActive },
    constants: { mainColor },
  } = useContext<any>(AppContext);
  const [selected, setSelected] = useState(subs[0].title);

  useEffect(() => {
    setItem(setFirstNote, "firstNote");
  }, []);
  
  useEffect(() => {
    setSelected(subs[0].title);
  }, [subs]);

  useEffect(() => {
    if (editNoteNumber !== -1) {
      setTitle(allNotes[editNoteNumber].title);
      setDesc(allNotes[editNoteNumber].desc);
      setSelected(allNotes[editNoteNumber].subject);
    }
  }, [editNoteNumber, allNotes]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (isAddNoteOpen.current) {
        showAddNote(-Dimensions.get("window").height);
        if (editNoteNumber >= 0) {
          setTimeout(() => {
            setTitle("");
            setDesc("");
            setEditNoteNumber(-1);
          }, 1000);
        }
        return true;
      }
    });
  }, [editNoteNumber]);

  const addNote = () => {
    let allRevisions = [startOfDay(new Date())];
    allRevisions.push(add(startOfDay(new Date()), { days: 1 }));
    allRevisions.push(add(startOfDay(new Date()), { weeks: 1 }));
    allRevisions.push(add(startOfDay(new Date()), { months: 1 }));
    allRevisions.push(add(startOfDay(new Date()), { months: 3 }));

    const tempAllNotes = [...allNotes];

    // for (let i = 0; i < 6000; i++) {
    tempAllNotes.unshift({
      id: uuidv4(),
      title: title,
      // title: title + i,
      desc,
      subject: selected,
      revisions: allRevisions,
      revisionNumber: 0,
      delete: false,
      show: true,
    });
    // }
    setAllNotes(tempAllNotes);
    setIsAnyNoteActive(true);
    setTimeout(() => {
      Keyboard.dismiss();
      noteAdded();
    }, 10);
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

  const editNote = () => {
    let tempAllNotes = [...allNotes];
    tempAllNotes[editNoteNumber].title = title;
    tempAllNotes[editNoteNumber].desc = desc;
    tempAllNotes[editNoteNumber].subject = selected;
    setAllNotes(tempAllNotes);

    setTimeout(() => {
      Keyboard.dismiss();
    }, 10);
    setTimeout(() => {
      setTitle("");
      setDesc("");
      setEditNoteNumber(-1);
    }, 1000);
  };

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
            if (editNoteNumber >= 0) {
              setTimeout(() => {
                setTitle("");
                setDesc("");
                setEditNoteNumber(-1);
              }, 500);
            }
          }}
        >
          <MaterialIcons name='arrow-back' size={24} color='white' />
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          style={{ padding: 10, opacity: title.trim() === "" ? 0.4 : 1 }}
          disabled={title.trim() === "" ? true : false}
          onPress={() => {
            if (editNoteNumber >= 0) {
              showAddNote(-Dimensions.get("window").height);
              editNote();
            } else {
              showAddNote(-Dimensions.get("window").height);
              addNote();
            }
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
            {editNoteNumber !== -1 ? "Note Edit" : "What you learned today?"}
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
            addInput
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
