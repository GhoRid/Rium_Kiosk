import { useState } from "react";
import styled from "styled-components";
import InputFileds from "./components/InputFileds";
import RadioGroup from "./components/RadioGroup";
import { colors } from "../../colors";
import { ReactComponent as DirectionDown } from "../../assets/svgs/directionDown.svg";

const digitsOnly = (s: string) => s.replace(/\D/g, "");
const fmtPhone = (v: string) => {
  const d = digitsOnly(v).slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};
const fmtBirth = (v: string) => digitsOnly(v).slice(0, 8);

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cert, setCert] = useState("");
  const [pin, setPin] = useState(""); // 4자리
  const [birth, setBirth] = useState(""); // YYYYMMDD
  const [gender, setGender] = useState("M");
  const [route, setRoute] = useState(""); // 가입 경로

  return (
    <Container>
      <Content>
        <Form>
          <InputFileds label="이름" value={name} onChange={setName} />

          <InputFileds
            label="휴대폰 번호"
            value={phone}
            onChange={setPhone}
            inputMode="numeric"
            normalizer={(s) => digitsOnly(s).slice(0, 11)}
            formatter={fmtPhone}
            action={{
              label: "인증 요청",
              onClick: () => console.log("send code"),
            }}
            rightSlot={
              <RightButton>
                <RightButtonText>인증 요청</RightButtonText>
              </RightButton>
            }
          />

          <InputFileds
            label="인증번호"
            value={cert}
            onChange={(v) => setCert(digitsOnly(v).slice(0, 6))}
            inputMode="numeric"
            action={{ label: "인증하기", onClick: () => console.log("verify") }}
            rightSlot={
              <RightButton>
                <RightButtonText>인증하기</RightButtonText>
              </RightButton>
            }
          />

          <InputFileds
            label="비밀번호 (4자리)"
            value={pin}
            onChange={(v) => setPin(digitsOnly(v).slice(0, 4))}
            type="password"
            inputMode="numeric"
          />

          <InputFileds
            label="생년월일(YYYYMMDD)"
            value={birth}
            onChange={setBirth}
            inputMode="numeric"
            normalizer={fmtBirth}
            rightSlot={
              <RadioGroup
                value={gender}
                onChange={setGender}
                options={[
                  { label: "남", value: "M" },
                  { label: "여", value: "F" },
                ]}
              />
            }
          />
        </Form>
      </Content>
    </Container>
  );
};

export default SignUpPage;

const Container = styled.div`
  background-color: ${colors.app_background};
  color: ${colors.app_white};
  height: 1920px;
`;

const Content = styled.div`
  margin: 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const RightButton = styled.button`
  color: ${colors.app_white};
  border: none;
  border-radius: 30px;
  cursor: pointer;
  padding: 0;
  width: 200px;
  height: 80px;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
`;

const RightButtonText = styled.span`
  font-size: 32px;
  color: ${colors.app_white};
  cursor: pointer;
`;
