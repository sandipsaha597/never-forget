import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createContext, useEffect, useRef } from "react";
import { LayoutAnimation, NativeModules, Platform } from "react-native";
import { v4 as uuidV4 } from "uuid";
import { isAnyNoteActiveFunc } from "../util/util";

export const AppContext = createContext();

export enum EnumSpacedRepetition {
  No = "no",
  Yes = "yes",
}

const { UIManager } = NativeModules;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function AppProvider(props: any) {
  const [
    knowSpacedRepetition,
    setKnowSpacedRepetition,
  ] = useState<EnumSpacedRepetition>(EnumSpacedRepetition.No);
  const [allNotes, setAllNotes] = useState<IAllNotes[]>([]);
  const [isAnyNoteActive, setIsAnyNoteActive] = useState<boolean>(null);
  // const [subs, setSubs] = useState<string[]>([
  //   "English",
  //   "Math",
  //   "Geography",
  //   "History",
  //   "--None--",
  // ]);

  const [subs, setSubs] = useState<{ id: string; title: string }[]>([
    {
      id: "1341284821",
      title: "English",
    },
    {
      id: "9245184821",
      title: "Math",
    },
    {
      id: "8281951025",
      title: "Geography",
    },
    {
      id: "0150102010",
      title: "History",
    },
    {
      id: "0131561052",
      title: "--None--",
    },
  ]);

  // refs

  const contextValue = {
    states: {
      knowSpacedRepetition,
      allNotes,
      subs,
      isAnyNoteActive,
    },
    constants: {
      rewardMsgTimeoutTime: 2000,
      mainColor: "#3178c6",
      externalLinkColor: "#296ab3",
    },
    actions: {
      async setAllNotes(values: IAllNotes[], save: boolean = true) {
        try {
          if (save) {
            await AsyncStorage.setItem("allNotes", JSON.stringify(values));
          }
          // LayoutAnimation.easeInEaseOut();
          // LayoutAnimation.configureNext(
          //   LayoutAnimation.create(
          //     500,
          //     LayoutAnimation.Types.easeInEaseOut,
          //     LayoutAnimation.Properties.scaleXY
          //   )
          // );
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setAllNotes(values);
        } catch (err) {
          alert(err);
          console.log("err", err);
        }
      },
      async setKnowSpacedRepetition(values: EnumSpacedRepetition) {
        try {
          await AsyncStorage.setItem(
            "knowSpacedRepetition",
            JSON.stringify(values)
          );
          setKnowSpacedRepetition(values);
        } catch (err) {
          alert(err);
          console.log("err", err);
        }
      },
      async setSubs(values: { id: string; title: string }[]) {
        try {
          await AsyncStorage.setItem("subs", JSON.stringify(values));
          LayoutAnimation.easeInEaseOut();
          setSubs(values);
        } catch (err) {
          alert(err);
          console.log("err", err);
        }
      },
      async setIsAnyNoteActive(val: boolean) {
        try {
          await AsyncStorage.setItem("isAnyNoteActive", JSON.stringify(val));
          setIsAnyNoteActive(val);
        } catch (err) {
          alert(err);
          console.log("err", err);
        }
      },
    },
  };
  // AsyncStorage.removeItem('knowSpacedRepetition')
  // AsyncStorage.removeItem('allNotes')
  // AsyncStorage.removeItem('isAnyNoteActive')
  // AsyncStorage.removeItem('subs')

  // contextValue.actions.setSubs([
  //   "English",
  //   "Math",
  //   "Geography",
  //   "History",
  //   "jalapino",
  //   "HTML",
  //   "--None--",
  // ]);
  const setItem = async (toSet: any, itemName: string) => {
    const value = await AsyncStorage.getItem(itemName);
    if (value) {
      toSet(JSON.parse(value) as any);
    }
  };

  const retrieveAllNotesDeleteStatus = async () => {
    if (isAnyNoteActive === null) {
      const storedIsAnyNoteActive = await AsyncStorage.getItem(
        "isAnyNoteActive"
      );
      if (
        storedIsAnyNoteActive === "false" ||
        storedIsAnyNoteActive === "true"
      ) {
        setIsAnyNoteActive(JSON.parse(storedIsAnyNoteActive));
      } else {
        isAnyNoteActiveFunc(allNotes, contextValue.actions.setIsAnyNoteActive);
      }
    }
  };
  useEffect(() => {
    setItem(setAllNotes, "allNotes");
    setItem(setKnowSpacedRepetition, "knowSpacedRepetition");
    setItem(setSubs, "subs");
    retrieveAllNotesDeleteStatus();
  }, []);

  useEffect(() => {
    if (subs.length !== 0 && !subs[0].id) {
      let newSubStructure: any = [];
      subs.forEach((v: any) => {
        newSubStructure.push({
          id: uuidV4(),
          title: v,
        });
      });
      contextValue.actions.setSubs(newSubStructure);
    }
  }, [subs]);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

// interfaces

export interface IAllNotes {
  id: string;
  title: string;
  subject: string;
  desc: string;
  revisions: any;
  revisionNumber: number;
  delete: boolean;
  show: boolean;
}
