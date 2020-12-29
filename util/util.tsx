export const isAnyNoteActiveFunc = (allNotes: any, setIsAnyNoteActive: any) => {
  const tempCheck = allNotes.every((v: any) => {
    return v.delete;
  });
  setIsAnyNoteActive(!tempCheck);
};

export const isRecycleBinEmptyFunc = (allNotes: any, setIsRecycleBinEmpty: any) => {
  const tempCheck = allNotes.find((v: any) => {
    return v.delete === true;
  });
  setIsRecycleBinEmpty(!!!tempCheck);
};
