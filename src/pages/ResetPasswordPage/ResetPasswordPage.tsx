import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import { colors } from "../../colors";
import { useMemo, useState } from "react";
import { digitsOnly, formatPhoneNumber } from "../../utils/formatPhoneNumber";
import InputFiled from "./components/InputFiled";
import BottomButtons from "../../components/BottomButtons";

const ResetPasswordPage = () => {
  type FieldName = "name" | "phone" | "birth";

  const [activeField, setActiveField] = useState<FieldName>("name");
  const [name, setName] = useState(""); // 4자리
  const [phone, setPhone] = useState(""); // 숫자만 저장
  const [birth, setBirth] = useState(""); // 생년월일

  const InputFiledList = useMemo(
    () => [
      {
        name: "name" as FieldName,
        placeholder: "이름",
        value: name,
        setValue: (v: string) => setName(v.slice(0, 20)),
      },
      {
        name: "phone" as FieldName,
        placeholder: "휴대폰 번호",
        value: formatPhoneNumber(phone),
        setValue: (v: string) => setPhone(digitsOnly(v).slice(0, 11)),
      },
      {
        name: "birth" as FieldName,
        placeholder: "생년월일(YYYYMMDD)",
        value: birth,
        setValue: (v: string) => setBirth(digitsOnly(v).slice(0, 11)),
      },
    ],
    [name, phone, birth]
  );

  return (
    <Container>
      <GoToHomeButton />

      <Content>
        {InputFiledList.map((field) => (
          <InputFiled
            key={field.name}
            activeField={activeField}
            setActiveField={setActiveField}
            name={field.name}
            placeholder={field.placeholder}
            value={field.value}
            setValue={field.setValue}
          />
        ))}
        <BottomButtons
          submitName={"가입 정보 확인"}
          submit={() => console.log("d")}
        />
      </Content>
    </Container>
  );
};

export default ResetPasswordPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
`;

const Content = styled.div`
  margin: 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 520px;
`;
