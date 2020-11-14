import AsyncStorage from "@react-native-async-storage/async-storage";
import { startOfDay } from "date-fns";
import { te } from "date-fns/esm/locale";
import React, { useState, createContext, useEffect, useRef } from "react";
import { v4 as uuidV4 } from "uuid";

export const AppContext = createContext();

export enum EnumSpacedRepetition {
  No = "no",
  Yes = "yes",
}

export function AppProvider(props: any) {
  const [knowSpacedRepetition, setKnowSpacedRepetition] = useState<
    EnumSpacedRepetition
  >(EnumSpacedRepetition.No);
  const [allNotes, setAllNotes] = useState<IAllNotes[]>([]);
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
    },
    constants: {
      rewardMsgTimeoutTime: 2000,
      mainColor: "#3178c6",
      externalLinkColor: "#296ab3",
    },
    actions: {
      async setAllNotes(values: IAllNotes[]) {
        try {
          await AsyncStorage.setItem("allNotes", JSON.stringify(values));
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
      async setSubs(values: string[]) {
        try {
          await AsyncStorage.setItem("subs", JSON.stringify(values));
          setSubs(values);
        } catch (err) {
          alert(err);
          console.log("err", err);
        }
      },
    },
  };
  // AsyncStorage.removeItem('knowSpacedRepetition')
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

  useEffect(() => {
    setItem(setAllNotes, "allNotes");
    setItem(setKnowSpacedRepetition, "knowSpacedRepetition");
    setItem(setSubs, "subs");
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
}
