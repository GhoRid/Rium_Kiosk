import { stringify } from "querystring";
import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";

export type Seat = {
  id: number; //
  label: number;
  x: number;
  y: number;
  available: boolean;
};

type SeatMapProps = {
  seats: Seat[];
  backgroundUrl?: string;
  selectedSeat: number | null;
  onSelect: (selected: number | null) => void;
};

const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  backgroundUrl,
  selectedSeat,
  onSelect,
}) => {
  const toggle = (id: number, available: Seat["available"]) => {
    if (!available) return;
    if (selectedSeat === id) {
      onSelect(null); // 선택 해제
    } else {
      onSelect(id); // 선택
    }
  };

  return (
    <Wrap>
      <Canvas $bg={backgroundUrl}>
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
  );
};

export default SeatMap;

/* ----------- styles ----------- */

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
