import styled from "styled-components";
import { colors } from "../../../colors";
import React from "react";

type Props = {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};

const CodeInput = ({ placeholder, value, setValue }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValue(raw);
  };

  return (
    <Container>
      <FiledBox>
        <Field $hasValue={!!value}>
          <PlainInput
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
          />
        </Field>
      </FiledBox>
    </Container>
  );
};

export default CodeInput;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const FiledBox = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  gap: 20px;
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
  width: 760px;
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
