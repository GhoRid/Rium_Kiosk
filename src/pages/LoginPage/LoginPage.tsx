import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import NumberKeypad from "./components/NumberKeypad";
import InputFiled from "./components/InputFiled";
import { useState, useCallback, useMemo } from "react";
import AuthLinks from "./components/AuthLinks";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { ReactComponent as PhoneIcon } from "../../assets/svgs/phone.svg";
import { ReactComponent as LockIcon } from "../../assets/svgs/password.svg";
import { useLocation, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { validUser } from "../../apis/api/user";
import { saveUserId } from "../../utils/tokens";

type FieldName = "phone" | "password";
const digitsOnly = (s: string) => s.replace(/\D/g, "");

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectFromState = (location.state as any)?.from as string | undefined;
  const redirectFromQuery = searchParams.get("redirect") || undefined;
  const redirectTo = redirectFromState || redirectFromQuery || "/home";

  const [activeField, setActiveField] = useState<FieldName>("phone");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const userLoginMutation = useMutation({
    mutationFn: async () => {
      return await validUser({
        mobileNumber: digitsOnly(phone),
        password,
      });
    },
    onSuccess: (data) => {
      saveUserId(phone);
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      if ((error as any)?.response?.status) {
        console.error("로그인 실패:", (error as any).response.status);
      } else {
        console.error("로그인 실패:", error);
      }
    },
  });

  const handleKeypad = useCallback(
    (val: string) => {
      if (val === "지움") {
        if (activeField === "phone") setPhone((p) => p.slice(0, -1));
        else setPassword((p) => p.slice(0, -1));
        return;
      }
      if (activeField === "phone") {
        setPhone((p) => digitsOnly(p + val).slice(0, 11));
      } else {
        setPassword((p) => (p + val).slice(0, 4));
      }
    },
    [activeField]
  );

  const InputFiledList = useMemo(
    () => [
      {
        name: "phone" as FieldName,
        icon: <PhoneIcon />,
        placeholder: "휴대폰 번호",
        value: formatPhoneNumber(phone),
        setValue: (v: string) => setPhone(digitsOnly(v).slice(0, 11)),
      },
      {
        name: "password" as FieldName,
        icon: <LockIcon />,
        placeholder: "비밀번호",
        value: password,
        setValue: (v: string) => setPassword(v.slice(0, 4)),
      },
    ],
    [phone, password]
  );

  const canLogin = phone.length >= 10 && password.length === 4;

  const onSubmit = () => {
    if (!canLogin || userLoginMutation.isPending) return;
    userLoginMutation.mutate();
  };

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
            icon={field.icon}
            placeholder={field.placeholder}
            value={field.value}
            setValue={field.setValue}
          />
        ))}

        <LoginButton disabled={!canLogin} onClick={onSubmit}>
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
