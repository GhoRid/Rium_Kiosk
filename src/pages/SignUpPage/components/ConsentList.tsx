import React from "react";
import styled from "styled-components";
import { colors } from "../../../colors";

export type ConsentItem = {
  id: string;
  label: string; // 예) "서비스 이용약관 동의"
  required?: boolean; // (필수) 빨간 표시
  onView?: () => void; // 우측 "약관보기" 클릭 핸들러
};

type ConsentListProps = {
  items: ConsentItem[];
  value: Record<string, boolean>; // {id: checked}
  onChange: (next: Record<string, boolean>) => void;
  showTopDivider?: boolean;
};

const ConsentList = ({
  items,
  value,
  onChange,
  showTopDivider,
}: ConsentListProps) => {
  const toggle = (id: string) => {
    const next = { ...value, [id]: !value[id] };
    onChange(next);
  };

  return (
    <Wrap>
      {showTopDivider && <TopDivider />}

      {items.map((it) => (
        <Row key={it.id}>
          <Left onClick={() => toggle(it.id)}>
            <Checkbox
              role="checkbox"
              aria-checked={!!value[it.id]}
              data-checked={!!value[it.id]}
            >
              <CheckMark viewBox="0 0 24 24" data-checked={!!value[it.id]}>
                <polyline points="20 6 9 17 4 12" fill="none" strokeWidth="3" />
              </CheckMark>
            </Checkbox>

            <Label>
              {it.label}
              {it.required && <Required>(필수)</Required>}
            </Label>
          </Left>

          <ViewBtn type="button" onClick={it.onView}>
            약관보기
          </ViewBtn>
        </Row>
      ))}
    </Wrap>
  );
};

export default ConsentList;

/* ===== styles ===== */

const Wrap = styled.div`
  width: 100%;
  color: ${colors.app_white};
`;

const TopDivider = styled.div`
  width: 100%;
  height: 2px;
  background: #4a4f55;
  margin: 0 0 24px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
`;

const Left = styled.button`
  display: flex;
  align-items: center;
  gap: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const Checkbox = styled.span`
  width: 64px;
  height: 64px;
  border-radius: 8px;
  border: 4px solid #d7dbe0;
  position: relative;

  &[data-checked="true"] {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const CheckMark = styled.svg`
  position: absolute;
  inset: 0;
  margin: auto;
  width: 44px;
  height: 44px;
  stroke: ${colors.app_white};
  opacity: 0;
  transition: opacity 120ms ease;

  &[data-checked="true"] {
    opacity: 1;
  }
`;

const Label = styled.span`
  font-size: 40px;
  line-height: 1.2;
`;

const Required = styled.span`
  margin-left: 12px;
  color: #ff4a4a;
`;

const ViewBtn = styled.button`
  background: transparent;
  border: none;
  color: ${colors.app_white};
  font-size: 40px;
  padding: 8px 0;
  cursor: pointer;
  white-space: nowrap;
  opacity: 0.95;
`;
