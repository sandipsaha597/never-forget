import React, { useContext } from "react";
import { AppContext } from "../AppContext/AppContext";

// const {
//   state: { allNotes },
//   actions: { setIsAnyNoteActive },
// } = useContext<any>(AppContext);

export const isAnyNoteActiveFunc = (allNotes: any, setIsAnyNoteActive: any) => {
  const tempCheck = allNotes.every((v: any) => {
    return v.delete;
  });
  setIsAnyNoteActive(!tempCheck);
};
