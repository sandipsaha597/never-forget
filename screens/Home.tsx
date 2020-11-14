import { add, format, isBefore, isEqual, isFuture, sub } from "date-fns";
import React, { useContext } from "react";
import { Button, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { AppContext, IAllNotes } from "../AppContext/AppContext";
import { startOfDay } from "date-fns/esm";

export default function Home() {
  const {
    states: { allNotes },
    actions: { setAllNotes },
  } = useContext<any>(AppContext);

  const markAsRevised = (id: string) => {
    const tempAllNotes = [...allNotes];
    let index = undefined;
    tempAllNotes.find((v, i) => {
      if (v.id === id) {
        index = i;
      }
      return v.id === id;
    });

    tempAllNotes[index as any].revisionNumber += 1;
    setAllNotes(tempAllNotes);
  };

  const skip = (id: string) => {
    const tempAllNotes = [...allNotes];
    let index = undefined;
    tempAllNotes.find((v, i) => {
      if (v.id === id) {
        index = i;
      }
      return v.id === id;
    });

    tempAllNotes[index as any].revisions.splice(
      tempAllNotes[index as any].revisionNumber + 1,
      1
    );
    setAllNotes(tempAllNotes);
  };

  return allNotes.length !== 0 ? (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <FlatList
        data={allNotes}
        renderItem={({ item }) => {
          return (
            !isFuture(new Date(item.revisions[item.revisionNumber + 1])) && (
              <ReviewBox
                note={item as IAllNotes}
                markAsRevised={markAsRevised}
                skip={skip}
              />
            )
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: 'green'}} >
      <Text>No Notes yet</Text>
      <Text>No Notes yet</Text>
      <Text>No Notes yet</Text>
      <Text>No Notes yet</Text>
      <Text>No Notes yet</Text>
      <Text>No Notes yet</Text>
      <Text>No Notes yet</Text>
    </View>
  );
}

const ReviewBox = (props: {
  note: IAllNotes;
  markAsRevised: (id: string) => void;
  skip: (id: string) => void;
}) => {
  const { note, markAsRevised, skip } = props;
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
      <Text>{JSON.stringify(note.revisions)}</Text>
      {note.desc.trim() !== "" && (
        <Text style={{ fontSize: 20 }}>{note.desc}</Text>
      )}
      <Button title='mark as revised' onPress={() => markAsRevised(note.id)} />
      <Button title='Skip' color='red' onPress={() => skip(note.id)} />
    </View>
  );
};
