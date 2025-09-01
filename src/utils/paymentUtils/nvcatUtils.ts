import { H7 } from "./constants";

type nvcatUtilsType = "RESTART" | "NVCATSHUTDOWN" | "READER_RESET" | "GET_APPR";

export const nvcatUtils = (utilFunction: nvcatUtilsType): string => {
  return utilFunction + H7;
};
