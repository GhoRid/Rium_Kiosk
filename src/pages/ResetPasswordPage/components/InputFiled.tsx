import styled from "styled-components";
import { colors } from "../../../colors";
import React from "react";

type FieldName = "name" | "phone" | "birth";

type Props = {
  activeField: FieldName;
  setActiveField: (f: FieldName) => void;
  name: FieldName;
  placeholder: string;
  value: string; // 표시용 값 (phone은 포맷된 값)
  setValue: (value: string) => void; // 상태 갱신 (phone은 숫자만)
};

const InputFiled = ({
  activeField,
  setActiveField,
  name,
  placeholder,
  value,
  setValue,
}: Props) => {
  const isNumeric = name !== "name"; // phone/birth는 숫자 키패드 힌트

  return (
    <Container>
      <Field
        onClick={() => setActiveField(name)}
        data-active={activeField === name}
        $hasValue={!!value}
      >
        <PlainInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={name === "birth" ? "text" : name === "phone" ? "text" : "text"}
          inputMode={isNumeric ? "numeric" : undefined}
          autoComplete="off"
        />
      </Field>
    </Container>
  );
};

export default InputFiled;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Field = styled.div<{ $hasValue: boolean }>`
  user-select: none;
  display: flex;
  align-items: center;
  gap: 35px;
  border-bottom: ${({ $hasValue }) =>
    $hasValue
      ? `2px solid ${colors.app_white}`
      : `1px solid ${colors.app_white}`};
  padding: 0 20px;
  width: 100%;
  height: 100px;
`;

const PlainInput = styled.input`
  height: 36px;
  background: transparent;
  color: ${colors.app_white};
  font-size: 36px;

  &::placeholder {
    color: ${colors.app_white};
    opacity: 1;
  }
`;
