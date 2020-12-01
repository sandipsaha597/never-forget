import React, { memo, useContext, useEffect, useState } from "react";
import { Button, Dimensions, Image, Text, TextInput, View } from "react-native";
import { AppContext } from "../AppContext/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import {
  FlatList,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { isAnyNoteActiveFunc } from "../util/util";
import Dropdown from "../widgets/Dropdown";

export default function AllNotes(props: {
  showAddNote: (value: number, editNoteNumber: number) => void;
}) {
  const { showAddNote } = props;
  const [subjectFilterSelected, setSubjectFilterSelected] = useState("All");
  const [searchText, setSearchText] = useState<boolean | string>(false);
  const {
    states: { allNotes, isAnyNoteActive, subs },
    actions: { setAllNotes, setIsAnyNoteActive },
  } = useContext<any>(AppContext);
  const [subjectFilterOptions, setSubjectFilterOptions] = useState([
    {
      id: "32324923",
      title: "All",
    },
    ...subs,
  ]);

  // useEffect(() => {
  //   let tempSubs = [...subs]
  //   tempSubs.unshift('All')
  // }, [subs])

  const deleteNote = (index: any, id: any) => {
    let tempAllNotes = [...allNotes];
    // tempAllNotes = tempAllNotes.filter((v) => v.id !== id);
    tempAllNotes[index].delete = true;
    setAllNotes(tempAllNotes);
    isAnyNoteActiveFunc(allNotes, setIsAnyNoteActive);
  };
  console.log("=================");
  const editNote = (index: number) => {
    showAddNote(0, index);
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
    console.log("tempAllNotes 2", tempAllNotes);
    // console.log("allNotes", allNotes);
    setAllNotes(tempAllNotes, false);
    setSubjectFilterSelected(val);
  };

  const searchFilter = (val: any) => {
    const tempAllNotes: any = [...allNotes];

    if (val === "" || val === false) {
      tempAllNotes.forEach((v: any) => {
        v.show = true;
      });
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

  console.log("allNotes", allNotes);

  return isAnyNoteActive && allNotes.length !== 0 ? (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ marginLeft: 10 }}>
          <Dropdown
            selected={subjectFilterSelected}
            title='Subject'
            options={subjectFilterOptions}
            setSelected={subjectFilter}
            // styles={{marginVertical: 0 }}
          />
        </View>
        <View style={{ marginRight: 10 }}>
          <TouchableNativeFeedback onPress={() => setSearchText("")}>
            <AntDesign name='search1' size={24} color='black' />
          </TouchableNativeFeedback>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          top: searchText || searchText === "" ? 0 : -54,
          backgroundColor: "dodgerblue",
          width: "100%",
          padding: 13,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableNativeFeedback onPress={() => searchFilter(false)}>
          <AntDesign name='arrowleft' size={24} color='black' />
        </TouchableNativeFeedback>
        <TextInput
          placeholder='Search...'
          value={searchText ? searchText : ""}
          onChangeText={(val) => searchFilter(val)}
          style={{ marginLeft: 10 }}
        />
      </View>
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
    </View>
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
        source={require("../assets/icons/box.png")}
      />
      <Text>No Notes yet</Text>
    </View>
  );
}

const NoteBox = (props: {
  note: any;
  itemIndex: number;
  deleteNote: (index: any, id: any) => void;
  editNote: (index: number) => void;
}) => {
  const { note, itemIndex, deleteNote, editNote } = props;
  console.log("render allnotes", itemIndex);
  return (
    <View
      style={{
        marginBottom: 15,
        marginHorizontal: 10,
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
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
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableNativeFeedback
          onPress={() => {
            editNote(itemIndex);
          }}
          style={{ marginRight: 10 }}
        >
          <Image source={require("../assets/icons/pencil.png")} />
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={() => {
            deleteNote(itemIndex, note.id);
          }}
          style={{ alignSelf: "flex-end" }}
        >
          <Image source={require("../assets/icons/delete.png")} />
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};
