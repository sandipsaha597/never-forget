import React, { memo, useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  LayoutAnimation,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext } from "../AppContext/AppContext";
import {
  FlatList,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { add, differenceInSeconds, format, startOfDay } from "date-fns";
import * as Notifications from "expo-notifications";
import { isAnyNoteActiveFunc, isRecycleBinEmptyFunc } from "../util/util";
import Dropdown from "../widgets/Dropdown";
import { schedulePushNotification } from "./AddNote";

export default function AllNotes(props: {
  recycleBin?: boolean;
  showAddNote: (value: number, editNoteNumber?: number) => void;
}) {
  const { showAddNote, recycleBin } = props;
  const [subjectFilterSelected, setSubjectFilterSelected] = useState("All");
  const [searchText, setSearchText] = useState<boolean | string>(false);
  const TextInputRef = useRef<any>();
  const {
    states: { allNotes, subs, isAnyNoteActive, isRecycleBinEmpty },
    actions: { setAllNotes, setIsAnyNoteActive, setIsRecycleBinEmpty },
  } = useContext<any>(AppContext);
  const subjectFilterOptions = [
    {
      id: "32324923",
      title: "All",
    },
    ...subs,
  ];

  const deleteNote = (index: any, id: any, note: any, type?: string) => {
    let tempAllNotes = [...allNotes];
    // tempAllNotes = tempAllNotes.filter((v) => v.id !== id);
    if (type === "permanentDelete") {
      tempAllNotes.splice(index, 1);
      setAllNotes(tempAllNotes);
      isRecycleBinEmptyFunc(tempAllNotes, setIsRecycleBinEmpty);
    } else {
      if (type === "restore") {
        tempAllNotes[index].delete = false;
        setAllNotes(tempAllNotes);
        schedulePushNotification(note, false, note.title);
        setIsAnyNoteActive(true);
        isRecycleBinEmptyFunc(tempAllNotes, setIsRecycleBinEmpty);
      } else {
        tempAllNotes[index].delete = true;
        setAllNotes(tempAllNotes);
        schedulePushNotification(note, "delete", "");
        isAnyNoteActiveFunc(allNotes, setIsAnyNoteActive);
        setIsRecycleBinEmpty(false);
      }
    }
  };

  // Empty Recycle bin
  const deleteAll = () => {
    let tempAllNotes = [...allNotes];
    tempAllNotes = tempAllNotes.filter((v) => v.delete !== true);
    setAllNotes(tempAllNotes);
    isRecycleBinEmptyFunc(tempAllNotes, setIsRecycleBinEmpty);
  };

  const editNote = (index: number) => {
    showAddNote && showAddNote(0, index);
    let tempAllNotes = [...allNotes];
    // tempAllNotes[id]
  };

  const subjectFilter = (val: string) => {
    const tempAllNotes: any = [...allNotes];

    if (val === "All") {
      tempAllNotes.forEach((v: any) => {
        v.show = true;
      });
    } else {
      tempAllNotes.forEach((v: any) => {
        if (val !== v.subject) {
          v.show = false;
        } else {
          v.show = true;
        }
      });
    }
    setAllNotes(tempAllNotes, false);
    setSubjectFilterSelected(val);
  };

  const searchFilter = (val: any) => {
    const tempAllNotes: any = [...allNotes];

    if (val === "" || val === false) {
      tempAllNotes.forEach((v: any) => {
        v.show = true;
      });
      subjectFilter(subjectFilterSelected);
    } else {
      tempAllNotes.forEach((v: any) => {
        if (v.title.toLowerCase().includes(val.toLowerCase())) {
          v.show = true;
        } else {
          v.show = false;
        }
      });
    }
    setAllNotes(tempAllNotes, false);
    setSearchText(val);
  };

  return (
    <>
      {(isAnyNoteActive && allNotes.length !== 0) ||
      (recycleBin && allNotes.length !== 0) ? (
        recycleBin && isRecycleBinEmpty ? (
          // <Text>Recycle bin is empty</Text>
          <NoNotes
            source={require("../assets/icons/recycle-bin.png")}
            text='Recycle bin is empty'
          />
        ) : (
          <View
            style={{ backgroundColor: "#fff", flex: 1, overflow: "hidden" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{ marginLeft: 10, position: "relative", zIndex: 1 }}
                >
                  <Dropdown
                    selected={subjectFilterSelected}
                    title='Subject'
                    options={subjectFilterOptions}
                    setSelected={subjectFilter}
                    // styles={{marginVertical: 0 }}
                  />
                </View>
                {recycleBin && (
                  <View
                    style={{
                      marginLeft: 10,
                      backgroundColor: "#d63031",
                      borderRadius: 6,
                    }}
                  >
                    <TouchableNativeFeedback
                      style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                      onPress={deleteAll}
                    >
                      <Text>Delete All</Text>
                    </TouchableNativeFeedback>
                  </View>
                )}
              </View>
              <View style={{ marginRight: 10 }}>
                <TouchableNativeFeedback
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    TextInputRef.current.focus();
                    setSearchText("");
                  }}
                >
                  <AntDesign name='search1' size={24} color='black' />
                </TouchableNativeFeedback>
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                top: searchText || searchText === "" ? 0 : -54,
                backgroundColor: "#3178c6",
                width: "100%",
                padding: 13,
                flexDirection: "row",
                alignItems: "center",
                zIndex: 2
              }}
            >
              <TouchableNativeFeedback
                onPress={() => {
                  TextInputRef.current.blur();
                  searchFilter(false);
                }}
              >
                <AntDesign name='arrowleft' size={24} color='black' />
              </TouchableNativeFeedback>
              <TextInput
                ref={TextInputRef}
                placeholder='Search...'
                underlineColorAndroid='#3178c6'
                value={searchText ? searchText : ""}
                onChangeText={(val) => searchFilter(val)}
                style={{ marginLeft: 10, width: "80%" }}
              />
            </View>
            {!recycleBin ? (
              <FlatList
                contentContainerStyle={{ paddingBottom: 60 }}
                data={allNotes}
                renderItem={({ item, index }) =>
                  !item.delete && item.show ? (
                    <NoteBox
                      note={item}
                      itemIndex={index}
                      deleteNote={deleteNote}
                      editNote={editNote}
                    />
                  ) : null
                }
                keyExtractor={(item: any) => item.id}
              />
            ) : (
              <FlatList
                contentContainerStyle={{ paddingBottom: 60 }}
                data={allNotes}
                renderItem={({ item, index }) =>
                  item.delete && item.show ? (
                    <NoteBox
                      note={item}
                      itemIndex={index}
                      deleteNote={deleteNote}
                      recycleBin
                    />
                  ) : null
                }
                keyExtractor={(item: any) => item.id}
              />
            )}
          </View>
        )
      ) : (
        <NoNotes />
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

const NoNotes = (props: { source?: any; text?: string }) => {
  const { source, text } = props;
  return (
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
        source={source ? source : require("../assets/icons/box.png")}
        // source={require(source ? source : "../assets/icons/box.png")}
      />
      <Text>{text ? text : "No Notes yet"}</Text>
    </View>
  );
};

const NoteBox = (props: {
  note: any;
  itemIndex: number;
  deleteNote: (index: any, id: any, note: any, type?: string) => void;
  editNote?: (index: number) => void;
  recycleBin?: boolean;
}) => {
  const { note, itemIndex, deleteNote, editNote, recycleBin } = props;
  return (
    <View
      style={{
        marginBottom: 15,
        marginHorizontal: 10,
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>{note.title}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Image
          style={{ width: 40, height: 38, marginRight: 10 }}
          source={require("../assets/icons/calendar.png")}
        />
        <View>
          <Text>{format(new Date(note.revisions[0]), "dd-MMM-yyyy")}</Text>
          <Text>
            Next revision:{" "}
            {format(
              new Date(note.revisions[note.revisionNumber + 1]),
              "dd-MMM-yyyy"
            )}
          </Text>
        </View>
      </View>

      {note.desc.trim() !== "" && (
        <Text
          style={{
            fontSize: 20,
            includeFontPadding: false,
            marginBottom: 10,
          }}
        >
          {note.desc}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {editNote ? (
          <TouchableNativeFeedback
            onPress={() => {
              editNote && editNote(itemIndex);
            }}
          >
            <Image source={require("../assets/icons/pencil.png")} />
          </TouchableNativeFeedback>
        ) : (
          <TouchableNativeFeedback
            onPress={() => deleteNote(itemIndex, note.id, note, "restore")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#27ae60",
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ color: "#fff", paddingRight: 6 }}>Restore</Text>
            <Image
              style={{ height: 32, width: 32 }}
              source={require("../assets/icons/file.png")}
            />
          </TouchableNativeFeedback>
        )}
        <View style={{ marginLeft: 10 }}>
          <TouchableNativeFeedback
            style={{ alignSelf: "flex-end" }}
            onPress={() => {
              if (recycleBin) {
                deleteNote(itemIndex, note.id, note, "permanentDelete");
              } else {
                deleteNote(itemIndex, note.id, note);
              }
            }}
          >
            {recycleBin ? (
              <Image source={require("../assets/icons/delete.png")} />
            ) : (
              <View style={{ width: 25 }}>
                <Image source={require("../assets/icons/soft-delete.png")} />
              </View>
            )}
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  );
};
