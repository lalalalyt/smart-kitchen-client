export const dateDifference = (date1: string, date2: string = "today") => {
  const dateAPI1 = new Date(date1).getTime();
  const dateAPI2 =
    date2 === "today" ? new Date().getTime() : new Date(date2).getTime();
  if (dateAPI1 <= dateAPI2) {
    return 0;
  }
  const microSecondsDiff = Math.abs(dateAPI1 - dateAPI2);
  const daysDiff = Math.round(microSecondsDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};
