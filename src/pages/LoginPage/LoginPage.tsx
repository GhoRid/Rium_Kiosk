import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import NumberKeypad from "./components/NumberKeypad";
import InputFileds from "./components/InputFileds";
import { useState, useCallback } from "react";
import AuthLinks from "./components/AuthLinks";

const LoginPage = () => {
  const [activeField, setActiveField] = useState<"phone" | "password">("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleKeypad = useCallback(
    (val: string) => {
      if (val === "지움") {
        if (activeField === "phone") {
          setPhone((p) => p.slice(0, -1));
        } else {
          setPassword((p) => p.slice(0, -1));
        }
        return;
      }

      if (activeField === "phone") {
        setPhone((p) => {
          const next = p + val;
          return next.replace(/\D/g, "").slice(0, 11);
        });
      } else {
        setPassword((p) => {
          const next = p + val;
          return next.slice(0, 4);
        });
      }
    },
    [activeField]
  );

  const formatPhoneNumber = (phone: string) => {
    let digits = phone.replace(/\D/g, "");

    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    if (digits.length < 4) {
      return digits;
    } else if (digits.length < 8) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
  };

  return (
    <Container>
      <GoToHomeButton />

      <Content>
        <InputFileds
          activeField={activeField}
          setActiveField={setActiveField}
          phone={formatPhoneNumber(phone)}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
        />

        <LoginButton disabled={!phone || !password}>
          <LoginText>로그인</LoginText>
        </LoginButton>

        <AuthLinks />

        <NumberKeypad onPress={handleKeypad} />
      </Content>
    </Container>
  );
};

export default LoginPage;

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
  padding-top: 520px;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 136px;
  border-radius: 30px;
  background-color: ${colors.app_main_color};
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;

  margin-top: 55px;
  margin-bottom: 60px;
`;

const LoginText = styled.span`
  color: ${colors.app_white};
  font-size: 40px;
  font-weight: bold;
`;
