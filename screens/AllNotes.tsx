import React, { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AppContext } from "../AppContext/AppContext";
import { FontAwesome } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

export default function AllNotes() {
  const {
    states: { allNotes },
    actions: { setAllNotes },
  } = useContext<any>(AppContext);

  const deleteNote = (id: string) => {
    let tempAllNotes = [...allNotes];
    tempAllNotes = tempAllNotes.filter((v) => v.id !== id);
    setAllNotes(tempAllNotes);
  };

  return (
    <View style={{ marginTop: 10, backgroundColor: "red", flex: 1 }}>
      <FlatList
        data={allNotes}
        renderItem={({ item }) => (
          <NoteBox note={item} deleteNote={deleteNote} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const NoteBox = (props: { note: any; deleteNote: (id: string) => void }) => {
  const { note, deleteNote } = props;
  return (
    <View
      style={{
        margin: 10,
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>{note.title}</Text>
      {note.subject !== "--None--" && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              borderRadius: 50,
              backgroundColor: "#b2bec3",
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            {note.subject}
          </Text>
          <FontAwesome
            name='repeat'
            size={24}
            color='black'
            style={{ marginLeft: 10 }}
          />
          <Text style={{ fontSize: 16, marginLeft: 4 }}>
            {note.revisionNumber}
          </Text>
        </View>
      )}
      {note.desc.trim() !== "" && (
        <Text style={{ fontSize: 20 }}>{note.desc}</Text>
      )}
      <Button
        title='delete'
        onPress={() => {
          deleteNote(note.id);
        }}
      />
    </View>
  );
};
