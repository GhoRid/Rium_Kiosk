import styled from "styled-components";
import { colors } from "../../../colors";

type Props = {
  activeField: "name" | "phone" | "birth";
  setActiveField: (f: "name" | "phone" | "birth") => void;
  name: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};

const InputFiled = ({
  activeField,
  setActiveField,
  name,
  placeholder,
  value,
  setValue,
}: Props) => {
  return (
    <Container>
      <Field
        key={name}
        onClick={() => setActiveField(name as "name" | "phone" | "birth")}
        data-active={activeField === name}
      >
        <PlainInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          type={name === "password" ? "password" : "text"}
          inputMode="numeric"
        />
      </Field>
    </Container>
  );
};

export default InputFiled;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;
  width: 100%;
  height: 100%;
`;

const Field = styled.div`
  user-select: none;
  display: flex;
  align-items: center;
  gap: 35px;
  border-bottom: 1px solid ${colors.app_white};
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
