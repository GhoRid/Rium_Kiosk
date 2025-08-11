import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as PhoneIcon } from "../../../assets/svgs/phone.svg";
import { ReactComponent as LockIcon } from "../../../assets/svgs/password.svg";

type Props = {
  activeField: "phone" | "password";
  setActiveField: (f: "phone" | "password") => void;
  phone: string;
  setPhone: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
};

const Filed = ({
  activeField,
  setActiveField,
  phone,
  setPhone,
  password,
  setPassword,
}: Props) => {
  const FiledList = [
    {
      name: "phone",
      icon: <PhoneIcon />,
      placeholder: "휴대폰 번호",
      value: phone,
      setValue: setPhone,
    },
    {
      name: "password",
      icon: <LockIcon />,
      placeholder: "비밀번호",
      value: password,
      setValue: setPassword,
    },
  ];

  return (
    <>
      {FiledList.map((field) => (
        <Field
          key={field.name}
          onClick={() => setActiveField(field.name as "phone" | "password")}
          data-active={activeField === field.name}
        >
          {field.icon}
          <PlainInput
            value={field.value}
            onChange={(e) => field.setValue(e.target.value)}
            placeholder={field.placeholder}
            type={field.name === "password" ? "password" : "text"}
            inputMode="numeric"
          />
        </Field>
      ))}
    </>
  );
};

export default Filed;

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
