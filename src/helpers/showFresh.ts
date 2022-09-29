import { dateDifference } from "./dateDifference";

export const showFresh = (date1: string, date2: string) => {
  let fresh = 0;
  if (dateDifference(date2) === 0) {
    fresh = 0;
  } else {
    //console.log("now",dateDifference(date2),"gap",dateDifference(date2, date1))
    fresh = Math.round(
      (dateDifference(date2) / dateDifference(date2, date1)) * 5
    );
  }
  if (fresh === 0) return "🔥";
  let leaf = "";
  for (let i = 0; i < fresh; i++) {
    leaf += "🌿";
  }
  return leaf;
};
