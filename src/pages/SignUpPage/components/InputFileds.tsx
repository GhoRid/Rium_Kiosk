import { ReactNode, useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";

export type InputFiledsProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "password";
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"]; // ✅ 수정
  normalizer?: (raw: string) => string;
  rightSlot?: ReactNode;
  error?: string;
};

const InputFileds = ({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  normalizer,
  rightSlot,
  error,
}: InputFiledsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = normalizer ? normalizer(raw) : raw;
    onChange(next);
  };

  return (
    <Wrapper>
      <FiledBox>
        <Field $hasRightSlot={!!rightSlot} $hasValue={!!value}>
          <PlainInput
            value={value}
            onChange={handleChange}
            placeholder={label}
            type={type}
            inputMode={inputMode}
          />
        </Field>
        {rightSlot && <>{rightSlot}</>}
      </FiledBox>
      {!!error && (
        <ErrorMsgBox>
          <ErrorMsg>{error}</ErrorMsg>
        </ErrorMsgBox>
      )}
    </Wrapper>
  );
};

export default InputFileds;

const Wrapper = styled.div`
  position: relative;
`;

const FiledBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  gap: 20px;
`;

const Field = styled.div<{ $hasRightSlot: boolean; $hasValue: boolean }>`
  user-select: none;
  display: flex;
  align-items: center;
  gap: 35px;
  border-bottom: ${({ $hasValue }) =>
    $hasValue
      ? `2px solid ${colors.app_white}`
      : `1px solid ${colors.app_white}`};
  width: ${({ $hasRightSlot }) => ($hasRightSlot ? "540px" : "100%")};
  height: 100px;
`;

const PlainInput = styled.input`
  background: transparent;
  color: ${colors.app_white};
  font-size: 36px;

  &::placeholder {
    color: ${colors.app_white};
    opacity: 1;
  }
`;

const ErrorMsgBox = styled.div`
  position: absolute;
  margin-top: 5px;
`;

const ErrorMsg = styled.p`
  color: #ff0000;
  font-size: 24px;
`;
