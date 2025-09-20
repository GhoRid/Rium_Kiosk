import { useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { getUserId, clearUserId } from "../utils/tokens";

const IDLE_MS = 300000;
const activityEvents = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
] as const;

export default function IdleWatcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  const startIdleTimer = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (getUserId()) {
        clearUserId();
        navigate("/home", { replace: true });
      }
      timerRef.current = null;
    }, IDLE_MS);
  }, [location.pathname, location.search, location.hash, navigate]);

  const handleActivity = useCallback(() => startIdleTimer(), [startIdleTimer]);

  useEffect(() => {
    const loggedIn = Boolean(getUserId());
    if (!loggedIn || location.pathname === "/login") {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return; // 로그인 X 또는 /login이면 감시 안 함
    }

    startIdleTimer();
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, handleActivity)
      );
    };
  }, [location.pathname, handleActivity, startIdleTimer]);

  return null;
}
