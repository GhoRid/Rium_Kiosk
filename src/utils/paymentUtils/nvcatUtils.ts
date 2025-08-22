import { H7 } from "./constants";

type nvcatUtils = "RESTART" | "NVCATSHUTDOWN" | "READER_RESET" | "GET_APPR";

export const nvcatUtils = (utilFunction: nvcatUtils): string => {
  return utilFunction + H7;
};
