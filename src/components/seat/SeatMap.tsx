import React from "react";
import styled from "styled-components";
import { colors } from "../../colors";
import SeatMapImage from "../../assets/images/seatMapBackground.png";

const seats: Seat[] = [
  { id: 1, label: 1, x: 90, y: 57.8, available: false },
  { id: 2, label: 2, x: 90, y: 48.7, available: true },
  { id: 3, label: 3, x: 90, y: 39.6, available: false },
  { id: 4, label: 4, x: 90, y: 30.45, available: true },
  { id: 5, label: 5, x: 90, y: 21.35, available: false },
  { id: 6, label: 6, x: 90, y: 12.25, available: true },
  { id: 7, label: 7, x: 81.05, y: 2, available: true },
  { id: 8, label: 8, x: 71.15, y: 2, available: true },
  { id: 9, label: 9, x: 61.25, y: 2, available: true },
  { id: 10, label: 10, x: 51.3, y: 2, available: true },
  { id: 11, label: 11, x: 41.35, y: 2, available: true },
  { id: 12, label: 12, x: 22, y: 2, available: true },
  { id: 13, label: 13, x: 12.05, y: 2, available: true },
  { id: 14, label: 14, x: 2.15, y: 2, available: true },

  { id: 15, label: 15, x: 62.15, y: 20.7, available: true },
  { id: 16, label: 16, x: 62.15, y: 29.8, available: true },
  { id: 17, label: 17, x: 62.15, y: 38.85, available: true },
  { id: 18, label: 18, x: 62.15, y: 47.95, available: true },
  { id: 19, label: 19, x: 62.15, y: 57, available: true },

  { id: 20, label: 20, x: 39.5, y: 20.7, available: true },
  { id: 21, label: 21, x: 39.5, y: 29.8, available: true },
  { id: 22, label: 22, x: 39.5, y: 38.85, available: true },
  { id: 23, label: 23, x: 39.5, y: 47.95, available: true },
  { id: 24, label: 24, x: 39.5, y: 57, available: true },

  { id: 25, label: 25, x: 14.7, y: 22.4, available: true },
  { id: 26, label: 26, x: 14.7, y: 31.5, available: true },
  { id: 27, label: 27, x: 14.7, y: 40.4, available: true },
  { id: 28, label: 28, x: 14.7, y: 49.4, available: true },
  { id: 29, label: 29, x: 14.7, y: 58.4, available: true },
  { id: 30, label: 30, x: 14.7, y: 67.4, available: true },

  { id: 31, label: 31, x: 2.1, y: 90.5, available: true },
  { id: 32, label: 32, x: 11.95, y: 90.5, available: true },
  { id: 33, label: 33, x: 21.8, y: 90.5, available: true },
  { id: 34, label: 34, x: 31.6, y: 90.5, available: true },
  { id: 35, label: 35, x: 41.45, y: 90.5, available: true },
  { id: 36, label: 36, x: 51.3, y: 90.5, available: true },
];

export type Seat = {
  id: number; //
  label: number;
  x: number;
  y: number;
  available: boolean;
};

type SeatMapProps = {
  selectedSeat: number | null;
  onSelect: (selected: number | null) => void;
};

const SeatMap: React.FC<SeatMapProps> = ({ selectedSeat, onSelect }) => {
  const toggle = (id: number, available: Seat["available"]) => {
    if (!available) return;
    if (selectedSeat === id) {
      onSelect(null); // 선택 해제
    } else {
      onSelect(id); // 선택
    }
  };

  return (
    <>
      <Wrap>
        <Canvas $bg={SeatMapImage}>
          {seats.map((s) => (
            <SeatBtn
              key={s.id}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              $selected={selectedSeat === s.id}
              $disabled={!s.available}
              type="button"
              role="checkbox"
              onClick={() => toggle(s.id, s.available)}
              aria-checked={selectedSeat === s.id}
              aria-label={`Seat ${s.label}`}
              title={String(s.label)}
            >
              <SeatLabel $selected={selectedSeat === s.id}>{s.label}</SeatLabel>
            </SeatBtn>
          ))}
        </Canvas>
      </Wrap>
      <Legend />
    </>
  );
};

export default SeatMap;

const Wrap = styled.div`
  width: 100%;
  height: auto;
`;

const Canvas = styled.div<{ $bg?: string }>`
  position: relative;
  width: 100%;
  height: 950px;

  background: ${({ $bg }) =>
    $bg ? `url(${$bg}) center / contain no-repeat` : "transparent"};
`;

const SeatBtn = styled.button<{ $selected: boolean; $disabled: boolean }>`
  position: absolute;
  width: 70px;
  aspect-ratio: 1;
  background: ${({ $disabled, $selected }) =>
    $disabled ? "#333" : $selected ? colors.app_white : "transparent"};
  color: #e9edf3;
  border: ${({ $disabled, $selected }) =>
    $disabled || $selected
      ? "2px solid transparent"
      : `2px solid ${colors.app_white}`};
  place-items: center;
`;

const SeatLabel = styled.span<{ $selected: boolean }>`
  font-size: 18px;
  color: ${({ $selected }) =>
    $selected ? colors.app_black : colors.app_white};
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  color: #cfd5dc;
  font-size: 16px;
`;

const LegendItem = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

const Swatch = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 4px;
`;
