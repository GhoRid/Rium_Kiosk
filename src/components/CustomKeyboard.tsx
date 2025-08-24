import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import styled from "styled-components";
import "react-simple-keyboard/build/css/index.css";
import { colors } from "../colors";

const koreanLayout = {
  default: [
    "ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ",
    "ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ",
    "{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {pre}",
    "{lang} {space} {dot}",
  ],
  shift: [
    "ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ",
    "ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ",
    "{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {pre}",
    "{lang} {space} {dot}",
  ],
};

const englishLayout = {
  default: [
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "{shift} z x c v b n m {pre}",
    "{lang} {space} {dot}",
  ],
  shift: [
    "Q W E R T Y U I O P",
    "A S D F G H J K L",
    "{shift} Z X C V B N M {pre}",
    "{lang} {space} {dot}",
  ],
};

const DISPLAY = {
  "{shift}": "Shift",
  "{pre}": "←",
  "{space}": "Space",
  "{dot}": ".",
  "{lang}": "한/영",
};

const CLOSE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 0.55;

type CustomKeyboardProps = {
  text: string;
  setText: (text: string) => void;
  setKeyboardVisible: (visible: boolean) => void;
};

const CustomKeyboard = ({
  text,
  setText,
  setKeyboardVisible,
}: CustomKeyboardProps) => {
  const [layoutName, setLayoutName] = useState<"default" | "shift">("default");
  const [lang, setLang] = useState<"kr" | "en">("kr");

  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounting, setMounting] = useState(true);
  const [translateY, setTranslateY] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ y: number; t: number } | null>(null);
  const velocityRef = useRef(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const h = el.getBoundingClientRect().height + 40;
    setPanelH(h);
    setTranslateY(h);
  }, []);

  useEffect(() => {
    if (panelH <= 0) return;
    const id = requestAnimationFrame(() => {
      setMounting(false);
      setTranslateY(0);
    });
    return () => cancelAnimationFrame(id);
  }, [panelH]);

  const onKeyPress = (key: string) => {
    switch (key) {
      case "{pre}":
        setText(text.slice(0, -1));
        break;
      case "{shift}":
        setLayoutName((p) => (p === "default" ? "shift" : "default"));
        break;
      case "{dot}":
        setText(text + ".");
        break;
      case "{space}":
        setText(text + " ");
        break;
      case "{lang}":
        setLang((p) => (p === "kr" ? "en" : "kr"));
        setLayoutName("default");
        break;
      default:
        setText(text + key);
    }
  };

  const layout = lang === "kr" ? koreanLayout : englishLayout;

  const smoothClose = () => {
    if (closing) return;
    const el = wrapperRef.current;
    if (!el) {
      setKeyboardVisible(false);
      return;
    }
    const h = el.getBoundingClientRect().height + 40;
    setDragging(false);
    setClosing(true);
    setTranslateY(h);
  };

  const onHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (closing) return;
    startYRef.current = e.clientY;
    lastPosRef.current = { y: e.clientY, t: performance.now() };
    velocityRef.current = 0;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || startYRef.current == null) return;
    const nowY = e.clientY;
    const dy = nowY - startYRef.current;
    setTranslateY(Math.max(0, dy));

    const prev = lastPosRef.current;
    const nowT = performance.now();
    if (prev) {
      const dt = nowT - prev.t || 1;
      const vy = (nowY - prev.y) / dt;
      velocityRef.current = vy > 0 ? vy : 0;
    }
    lastPosRef.current = { y: nowY, t: nowT };
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);

    const fastSwipe = velocityRef.current > VELOCITY_THRESHOLD;
    const farEnough = translateY > CLOSE_THRESHOLD;

    if (fastSwipe || farEnough) {
      smoothClose();
    } else {
      setTranslateY(0);
    }

    startYRef.current = null;
    lastPosRef.current = null;
    velocityRef.current = 0;
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    if (closing) {
      setKeyboardVisible(false);
    }
  };

  return (
    <Wrapper
      ref={wrapperRef}
      dragging={dragging}
      closing={closing}
      mounting={mounting}
      translateY={translateY}
      panelH={panelH}
      onTransitionEnd={onTransitionEnd}
    >
      <DragHandle
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label="키보드 드래그 핸들"
      >
        <Bar />
      </DragHandle>

      <Inner>
        <Keyboard
          layoutName={layoutName}
          layout={layout as any}
          onKeyPress={onKeyPress}
          display={DISPLAY}
          theme="hg-theme-default rium-kbd-lg"
          buttonTheme={[
            { class: "wide-key", buttons: "{space}" },
            { class: "medium-key", buttons: "{pre} {shift}" },
            // { class: "close-key", buttons: "{close}" },
            { class: "small-key", buttons: "{lang} {dot}" },
          ]}
        />
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  dragging: boolean;
  closing: boolean;
  mounting: boolean;
  translateY: number;
  panelH: number;
}>`
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 10;
  user-select: none;
  will-change: transform;

  transform: translateY(${(p) => (p.mounting ? p.panelH : p.translateY)}px);

  transition: ${(p) =>
    p.dragging || p.mounting
      ? "none"
      : "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)"};
`;

const DragHandle = styled.div`
  width: 100%;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  touch-action: none;
  cursor: grab;
`;

const Bar = styled.div`
  width: 80px;
  height: 8px;
  border-radius: 6px;
  background: ${colors.app_white};
  opacity: 0.6;
`;

const Inner = styled.div`
  .hg-theme-default.rium-kbd-lg .hg-button {
    font-size: 28px !important;
    height: 74px !important;
    line-height: 1 !important;
    border-radius: 12px !important;
    color: ${colors.app_black} !important;
    background: ${colors.app_white} !important;
  }
  .hg-theme-default.rium-kbd-lg .hg-row {
    margin-bottom: 12px !important;
  }
  .hg-theme-default.rium-kbd-lg .wide-key {
    min-width: 60% !important;
  }
  .hg-theme-default.rium-kbd-lg .medium-key {
    min-width: 12% !important;
  }
  .hg-theme-default.rium-kbd-lg .small-key {
    min-width: 10% !important;
  }
`;

export default CustomKeyboard;
