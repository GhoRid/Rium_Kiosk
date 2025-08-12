import React from "react";
import styled from "styled-components";
import { colors } from "../../../colors";

export type ConsentItem = {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
};

type ConsentListProps = {
  items: ConsentItem[];
  onChange: any;
};

const ConsentList = ({ items, onChange }: ConsentListProps) => {
  const toggleCheckbox = (id: string) => {
    onChange((prev: any) =>
      prev.map((it: any) =>
        it.id === id ? { ...it, checked: !it.checked } : it
      )
    );
  };

  return (
    <Wrap>
      {items.map((it) => (
        <Row key={it.id}>
          <Left onClick={() => toggleCheckbox(it.id)}>
            <Checkbox role="checkbox">{it.checked && <CheckMark />}</Checkbox>

            <Label>
              {it.label}
              {it.required && <Required>(필수)</Required>}
            </Label>
          </Left>

          <ViewBtn type="button">
            <ViewBtnText>약관보기</ViewBtnText>
          </ViewBtn>
        </Row>
      ))}
    </Wrap>
  );
};

export default ConsentList;

const Wrap = styled.div`
  width: 100%;
  color: ${colors.app_white};
  margin-top: 60px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
  height: 90px;
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

const Checkbox = styled.div`
  width: 40px;
  aspect-ratio: 1;
  border: 2px solid #d7dbe0;
  position: relative;
`;

const CheckMark = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  aspect-ratio: 1;
  background-color: ${colors.app_white};
`;

const Label = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
  line-height: 1.2;
`;

const Required = styled.span`
  margin-left: 12px;
  color: #ff4a4a;
`;

const ViewBtn = styled.button`
  background: transparent;
  border: none;
  padding: 8px 0;
  cursor: pointer;
  opacity: 0.95;
`;

const ViewBtnText = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #d7dbe0;
  }
`;
