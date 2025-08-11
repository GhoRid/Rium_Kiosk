// components/FormRow.tsx
import { ReactNode, useState } from "react";
import styled from "styled-components";
import { colors } from "../../../colors";

export type FormRowProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "password";
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  formatter?: (raw: string) => string;
  normalizer?: (raw: string) => string;
  action?: { label: string; onClick: () => void; disabled?: boolean };
  rightSlot?: ReactNode;
  showDivider?: boolean;
};

const InputFileds = ({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
  formatter,
  normalizer,
  action,
  rightSlot,
}: FormRowProps) => {
  const [focused, setFocused] = useState(false);

  const display = formatter ? formatter(value) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const next = normalizer ? normalizer(raw) : raw;
    onChange(maxLength ? next.slice(0, maxLength) : next);
  };

  return (
    <Wrapper>
      <Field haseRightSlot={!!rightSlot}>
        <PlainInput
          value={display}
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

const Field = styled.div<{ haseRightSlot: boolean }>`
  user-select: none;
  display: flex;
  align-items: center;
  gap: 35px;
  border-bottom: 1px solid ${colors.app_white};
  width: ${(props) => (props.haseRightSlot ? "540px" : "100%")};
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
