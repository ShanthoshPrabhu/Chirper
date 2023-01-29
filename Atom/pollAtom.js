import { atom } from "recoil";

export const pollState = atom({
  key: "pollState",
  default: false,
});