import { useSyncExternalStore } from "react";
import { getUserId } from "../utils/tokens";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);

  window.addEventListener("authchange", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("authchange", onChange);
  };
};

export const useUserId = () =>
  useSyncExternalStore(subscribe, getUserId, getUserId);
