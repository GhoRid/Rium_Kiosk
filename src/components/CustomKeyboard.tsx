import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import styled from "styled-components";
import "react-simple-keyboard/build/css/index.css";
import { colors } from "../colors";
import hangul from "hangul-js";

type InputMode = "kr" | "en" | "num";

type CustomKeyboardProps = {
  text: string;
  setText: (text: string) => void;
  setKeyboardVisible: (visible: boolean) => void;
  allowedModes?: InputMode[];
  initialMode?: InputMode;
};

const CLOSE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 0.55;

const KOREAN_BASE = {
  default: [
    "ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ",
    "ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ",
    "{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {pre}",
  ],
  shift: [
    "ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ",
    "ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ",
    "{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ {pre}",
  ],
} as const;

const ENGLISH_BASE = {
  default: [
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "{shift} z x c v b n m {pre}",
  ],
  shift: [
    "Q W E R T Y U I O P",
    "A S D F G H J K L",
    "{shift} Z X C V B N M {pre}",
  ],
} as const;

const NUM_BASE = {
  default: ["7 8 9", "4 5 6", "1 2 3"],
  shift: ["7 8 9", "4 5 6", "1 2 3"],
} as const;

const DISPLAY = {
  "{shift}": "Shift",
  "{pre}": "←",
  "{space}": "Space",
  "{dot}": ".",
  "{lang}": "한/영",
  "{123}": "123",
  "{abc}": "ABC",
};

const CustomKeyboard = ({
  text,
  setText,
  setKeyboardVisible,
  allowedModes = ["kr", "en", "num"],
  initialMode,
}: CustomKeyboardProps) => {
  const allowKR = allowedModes.includes("kr");
  const allowEN = allowedModes.includes("en");
  const allowNUM = allowedModes.includes("num");
  const someAlpha = allowKR || allowEN;

  const firstAllowed: InputMode =
    initialMode && allowedModes.includes(initialMode)
      ? initialMode
      : allowedModes[0] ?? "kr";

  const [layoutName, setLayoutName] = useState<"default" | "shift">("default");
  const [mode, setMode] = useState<InputMode>(firstAllowed);

  const lastAlphaRef = useRef<InputMode>(allowKR ? "kr" : "en");

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

  const allowedSig = React.useMemo(
    () => [...allowedModes].join("|"),
    [allowedModes]
  );

  useEffect(() => {
    if (!allowedModes.includes(mode)) {
      const next =
        (initialMode && allowedModes.includes(initialMode) && initialMode) ||
        allowedModes[0] ||
        "num";
      setMode(next);
      setLayoutName("default");
    }
  }, [allowedSig]);

  useEffect(() => {
    if (panelH <= 0) return;
    const id = requestAnimationFrame(() => {
      setMounting(false);
      setTranslateY(0);
    });
    return () => cancelAnimationFrame(id);
  }, [panelH]);

  const makeAlphaBottomRow = () => {
    const row: string[] = [];
    if (allowKR && allowEN) row.push("{lang}");
    if (allowNUM) row.push("{123}");
    row.push("{space}", "{dot}");
    return row.join(" ");
  };

  const getLayout = () => {
    if (mode === "num") {
      const numBottomButtons = someAlpha ? "{abc} 0 {pre}" : "010 0 {pre}";
      return {
        default: [...NUM_BASE.default, numBottomButtons],
        shift: [...NUM_BASE.shift, numBottomButtons],
      };
    }
    const base = mode === "kr" ? KOREAN_BASE : ENGLISH_BASE;
    const bottom = makeAlphaBottomRow();
    return {
      default: [...base.default, bottom],
      shift: [...base.shift, bottom],
    };
  };

  const layout = getLayout();

  const onKeyPress = (key: string) => {
    switch (key) {
      case "{pre}":
        setText(text.slice(0, -1));
        break;
      case "{shift}":
        setLayoutName((p) => (p === "default" ? "shift" : "default"));
        break;
      case "{space}":
        setText(text + " ");
        break;
      case "{dot}":
        setText(text + ".");
        break;
      case "{123}":
        setLayoutName("default");
        setMode("num");
        break;
      case "{abc}":
        if (someAlpha) {
          setLayoutName("default");
          setMode(lastAlphaRef.current);
        }
        break;
      case "{lang}":
        if (mode === "kr" && allowEN) {
          setMode("en");
          lastAlphaRef.current = "en";
        } else if (mode === "en" && allowKR) {
          setMode("kr");
          lastAlphaRef.current = "kr";
        }
        setLayoutName("default");
        break;
      default:
        if (mode === "kr" && allowKR) {
          setText(hangul.assemble(hangul.disassemble(text + key)));
        } else {
          setText(text + key);
        }
        break;
    }
  };

  useEffect(() => {
    if (mode === "kr" || mode === "en") {
      lastAlphaRef.current = mode;
    }
  }, [mode]);

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

  const buttonTheme =
    mode === "num"
      ? []
      : [
          { class: "wide-key", buttons: "{space}" },
          { class: "medium-key", buttons: "{pre} {shift}" },
          { class: "small-key", buttons: "{lang} {dot} {123} {abc}" },
        ];

  return (
    <Wrapper
      ref={wrapperRef}
      $dragging={dragging}
      $closing={closing}
      $mounting={mounting}
      $translateY={translateY}
      $panelH={panelH}
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

      <Inner data-mode={mode} data-somealpha={someAlpha ? "1" : "0"}>
        <Keyboard
          layoutName={layoutName}
          layout={layout as any}
          onKeyPress={onKeyPress}
          display={DISPLAY}
          theme="hg-theme-default rium-kbd-lg"
          buttonTheme={buttonTheme as any}
        />
      </Inner>
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  $dragging: boolean;
  $closing: boolean;
  $mounting: boolean;
  $translateY: number;
  $panelH: number;
}>`
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 10;
  user-select: none;
  will-change: transform;
  transform: translateY(${(p) => (p.$mounting ? p.$panelH : p.$translateY)}px);
  transition: ${(p) =>
    p.$dragging || p.$mounting
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
    height: 80px !important;
    line-height: 1 !important;
    border-radius: 12px !important;
    color: ${colors.app_black} !important;
    background: ${colors.app_white} !important;
    transition: background-color 80ms ease, box-shadow 80ms ease,
      transform 80ms ease;
    -webkit-tap-highlight-color: transparent;
  }

  .hg-theme-default.rium-kbd-lg .hg-button:active {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.08) !important;
    transform: translateY(1px) scale(0.985);
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

  &[data-mode="num"] .hg-row {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  &[data-mode="num"][data-somealpha="0"] .hg-row:last-child {
    grid-template-columns: repeat(3, 1fr);
  }
  &[data-mode="num"] .hg-button {
    width: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
    box-sizing: border-box;
  }
`;

export default CustomKeyboard;
