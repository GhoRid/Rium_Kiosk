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
  maxLength?: number;
  normalizer?: (raw: string) => string;
  action?: { label: string; onClick: () => void; disabled?: boolean };
  rightSlot?: ReactNode;
};

const InputFileds = ({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  normalizer,
  action,
  rightSlot,
}: InputFiledsProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = normalizer ? normalizer(raw) : raw;
    onChange(maxLength ? next.slice(0, maxLength) : next);
  };

  return (
    <Wrapper>
      <Field $hasRightSlot={!!rightSlot} $hasValue={!!value}>
        <PlainInput
          value={value}
          onChange={handleChange}
          placeholder={label}
          type={type}
          inputMode={inputMode}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Field>
      {rightSlot && <>{rightSlot}</>}
    </Wrapper>
  );
};

export default InputFileds;

const Wrapper = styled.div`
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
