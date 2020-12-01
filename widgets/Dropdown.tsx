import React, { useState, useRef, useContext } from "react";
import {
  LayoutAnimation,
  NativeModules,
  Platform,
  Text,
  View,
} from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableNativeFeedback,
} from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from "../AppContext/AppContext";
import { v4 as uuidV4 } from "uuid";

// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true);

export default function Dropdown(props: {
  title: string;
  options: {
    id: string;
    title: string;
  }[];
  selected: string;
  setSelected: (val: string) => void;
  addInput?: boolean;
  deleteAble?: boolean;
  styles?: any;
}) {
  const {
    title,
    options,
    selected,
    setSelected,
    addInput,
    deleteAble,
    styles,
  } = props;
  const [addSubtext, setAddSubtext] = useState<string>("");
  const value = useRef(new Animated.Value(0)).current;
  const isDropDownOpen = useRef(false);

  const toggleDropdown = (toValue: number) => {
    isDropDownOpen.current = toValue === 0 ? false : true;
    Animated.timing(value, {
      toValue: toValue,
      duration: 200,
      easing: Easing.ease,
    }).start();
  };
  const {
    actions: { setSubs },
  } = useContext<any>(AppContext);

  return (
    <View style={{ flexDirection: "row", position: "relative" }}>
      <TouchableNativeFeedback
        style={[
          {
            flexDirection: "row",
            padding: 10,
            marginVertical: 10,
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#000",
          },
          styles,
        ]}
        onPress={() => {
          toggleDropdown(isDropDownOpen.current ? 0 : 200);
        }}
      >
        <Text style={{ marginRight: 10 }}>{title}:</Text>
        <Text>{selected}</Text>
        <Animated.View
          style={{
            marginLeft: 10,
          }}
        >
          <Ionicons name='ios-arrow-down' size={17} color='black' />
        </Animated.View>
      </TouchableNativeFeedback>

      <Animated.View
        style={{
          maxHeight: value,
          position: "absolute",
          top: 60,
          zIndex: 30,
          backgroundColor: "#fff",
          width: 200,
          overflow: "hidden",
          borderRadius: 10,
        }}
      >
        <ScrollView
          style={{
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#000",
          }}
        >
          {addInput && (
            <View style={{ flexDirection: "row", padding: 10 }}>
              <TextInput
                style={{
                  borderColor: "black",
                  borderBottomWidth: 1,
                  flex: 1,
                  marginRight: 10,
                }}
                underlineColorAndroid={"rgba(255,255,255,0)"}
                onChangeText={(val) => setAddSubtext(val)}
                placeholder='Add Subject'
                value={addSubtext}
              />
              <TouchableNativeFeedback
                style={{ opacity: addSubtext.trim() === "" ? 0.4 : 1 }}
                disabled={addSubtext.trim() === "" ? true : false}
                onPress={() => {
                  let tempSubs = [...options] as any;
                  tempSubs.unshift({
                    id: uuidV4(),
                    title: addSubtext,
                  });
                  setSubs(tempSubs);
                  setAddSubtext("");
                }}
              >
                <Ionicons name='ios-add-circle' size={29} color='#1dbf73' />
              </TouchableNativeFeedback>
            </View>
          )}
          {options.map((v: any, i: number) => (
            <View
              key={v.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableNativeFeedback
                  style={{ padding: 10 }}
                  onPress={() => {
                    setSelected(v.title);
                    toggleDropdown(0);
                  }}
                >
                  <Text>{v.title}</Text>
                </TouchableNativeFeedback>
              </View>
              {deleteAble && v.title !== "--None--" && (
                <View>
                  <TouchableNativeFeedback
                    style={{ padding: 7 }}
                    onPress={() => {
                      // LayoutAnimation.easeInEaseOut();
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.spring
                      );
                      let tempSubs = [...options];
                      tempSubs = tempSubs.filter((j: any) => j.id !== v.id);
                      setSubs(tempSubs);
                    }}
                  >
                    <MaterialIcons name='delete' size={24} color='black' />
                  </TouchableNativeFeedback>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}
