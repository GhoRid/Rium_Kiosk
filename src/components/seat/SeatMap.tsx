import React from "react";
import styled from "styled-components";
import { colors } from "../../colors";
import SeatMapImage from "../../assets/images/seatMapBackground.png";
import Legend from "./Legend";

export type Seat = {
  id: number;
  label: number; // 화면에 표시되는 좌석번호
  x: number; // 배치 (백분율)
  y: number; // 배치 (백분율)
};

type SeatState = {
  seatId: number;
  seatNumber: number;
  isReservedSeat: boolean;
  isUsing: boolean;
};

type SeatMapProps = {
  myseat?: {};
  selectedSeat: number | null;
  onSelect: (selected: number | null) => void;
  seatsState: SeatState[]; // ✅ 타입 명시
  usingSeatNumber?: number;
};

const seats: Seat[] = [
  { id: 1, label: 1, x: 90, y: 57.8 },
  { id: 2, label: 2, x: 90, y: 48.7 },
  { id: 3, label: 3, x: 90, y: 39.6 },
  { id: 4, label: 4, x: 90, y: 30.45 },
  { id: 5, label: 5, x: 90, y: 21.35 },
  { id: 6, label: 6, x: 90, y: 12.25 },
  { id: 7, label: 7, x: 81.05, y: 2 },
  { id: 8, label: 8, x: 71.15, y: 2 },
  { id: 9, label: 9, x: 61.25, y: 2 },
  { id: 10, label: 10, x: 51.3, y: 2 },
  { id: 11, label: 11, x: 41.35, y: 2 },
  { id: 12, label: 12, x: 22, y: 2 },
  { id: 13, label: 13, x: 12.05, y: 2 },
  { id: 14, label: 14, x: 2.15, y: 2 },

  { id: 15, label: 15, x: 62.15, y: 20.7 },
  { id: 16, label: 16, x: 62.15, y: 29.8 },
  { id: 17, label: 17, x: 62.15, y: 38.85 },
  { id: 18, label: 18, x: 62.15, y: 47.95 },
  { id: 19, label: 19, x: 62.15, y: 57 },

  { id: 20, label: 20, x: 39.5, y: 20.7 },
  { id: 21, label: 21, x: 39.5, y: 29.8 },
  { id: 22, label: 22, x: 39.5, y: 38.85 },
  { id: 23, label: 23, x: 39.5, y: 47.95 },
  { id: 24, label: 24, x: 39.5, y: 57 },

  { id: 25, label: 25, x: 14.7, y: 22.4 },
  { id: 26, label: 26, x: 14.7, y: 31.5 },
  { id: 27, label: 27, x: 14.7, y: 40.4 },
  { id: 28, label: 28, x: 14.7, y: 49.4 },
  { id: 29, label: 29, x: 14.7, y: 58.4 },
  { id: 30, label: 30, x: 14.7, y: 67.4 },

  { id: 31, label: 31, x: 2.1, y: 90.5 },
  { id: 32, label: 32, x: 11.95, y: 90.5 },
  { id: 33, label: 33, x: 21.8, y: 90.5 },
  { id: 34, label: 34, x: 31.6, y: 90.5 },
  { id: 35, label: 35, x: 41.45, y: 90.5 },
  { id: 36, label: 36, x: 51.3, y: 90.5 },
];

const SeatMap: React.FC<SeatMapProps> = ({
  selectedSeat,
  onSelect,
  seatsState,
  usingSeatNumber,
}) => {
  const toggle = (id: number, disabled: boolean) => {
    if (disabled) return;
    onSelect(selectedSeat === id ? null : id);
  };

  const seatsStateList = React.useMemo<SeatState[]>(() => {
    if (Array.isArray(seatsState)) return seatsState;
    if (seatsState && typeof seatsState === "object") {
      return Object.values(seatsState);
    }
    return [];
  }, [seatsState]);

  return (
    <Wrap>
      <Legend />
      <Canvas $bg={SeatMapImage}>
        {seats.map((s) => {
          const live = seatsStateList?.find(
            (v) => v.seatId === s.id || v.seatNumber === s.label
          );

          const isUsingMySeat = usingSeatNumber == s.id;

          const isDisabled = !!live?.isUsing;

          return (
            <SeatBtn
              key={s.id}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              $isUsingSeat={isUsingMySeat}
              $selected={selectedSeat === s.id}
              $disabled={isDisabled}
              disabled={isDisabled}
              type="button"
              onClick={() => toggle(s.id, isDisabled)}
              aria-checked={selectedSeat === s.id}
              aria-label={`Seat ${s.label}`}
              title={String(s.label)}
            >
              <SeatLabel $selected={selectedSeat === s.id}>{s.label}</SeatLabel>
            </SeatBtn>
          );
        })}
      </Canvas>
    </Wrap>
  );
};

export default SeatMap;

const Wrap = styled.div`
  width: 100%;
  height: auto;
`;

const Canvas = styled.div<{ $bg?: string }>`
  position: relative;
  width: 880px;
  height: 950px;
  background: ${({ $bg }) =>
    $bg ? `url(${$bg}) center / contain no-repeat` : "transparent"};
`;

const SeatBtn = styled.button<{
  $isUsingSeat: boolean;
  $selected: boolean;
  $disabled: boolean;
}>`
  position: absolute;
  width: 70px;
  aspect-ratio: 1;
  display: grid;
  place-items: center;

  background: ${({ $isUsingSeat, $disabled, $selected }) =>
    $isUsingSeat
      ? "#A90003"
      : $selected
      ? colors.app_white
      : $disabled
      ? "#333"
      : "transparent"};

  color: ${({ $selected }) => ($selected ? colors.app_black : "#e9edf3")};

  border: ${({ $isUsingSeat, $disabled, $selected }) =>
    $disabled || $selected || $isUsingSeat
      ? "2px solid transparent"
      : `2px solid ${colors.app_white}`};

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  user-select: none;
`;

const SeatLabel = styled.span<{ $selected: boolean }>`
  font-size: 18px;
  color: ${({ $selected }) =>
    $selected ? colors.app_black : colors.app_white};
`;
