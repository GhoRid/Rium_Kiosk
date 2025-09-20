import styled from "styled-components";
import { colors } from "../../colors";
import { useMutation } from "@tanstack/react-query";
import { loginKiosk } from "../../apis/api/kioskAuth";
import Input from "./components/Input";
import { useMemo, useState } from "react";
import { saveTokens } from "../../utils/tokens";
import { useNavigate } from "react-router";
import CustomKeyboard from "../../components/CustomKeyboard";

type ActiveField = "id" | "password";

const KioskLoginPage = () => {
  const navigate = useNavigate();
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<ActiveField>("id");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (vars: { loginId: string; password: string }) =>
      loginKiosk({ loginId: vars.loginId, password: vars.password }),
    onSuccess: (res) => {
      const jwt = res?.data?.jwt ?? res?.data?.data?.jwt;
      const refreshToken =
        res?.data?.refreshToken ?? res?.data?.data?.refreshToken;
      saveTokens(jwt, refreshToken);
      navigate("/home", { replace: true });
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });

  const InputFiledList = useMemo(
    () => [
      {
        name: "id",
        placeholder: "로그인 아이디",
        value: id,
        setValue: (v: string) => setId(v.replace(/\s/g, "")),
      },
      {
        name: "password",
        placeholder: "비밀번호",
        value: password,
        setValue: (v: string) => setPassword(v.replace(/\s/g, "")),
      },
    ],
    [id, password]
  );

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    mutate({ loginId: id.trim(), password });
  };

  const handleActivateField = (name: ActiveField) => {
    setActiveField(name);
    if (!keyboardVisible) setKeyboardVisible(true);
  };

  const activeValue = activeField === "id" ? id : password;
  const setActiveValue = (next: string) => {
    if (activeField === "id") setId(next.replace(/\s/g, ""));
    else setPassword(next.replace(/\s/g, ""));
  };

  return (
    <Container>
      <Content as="form" onSubmit={handleSubmit}>
        <MessageBox>
          <Message>리움 키오스크 로그인</Message>
        </MessageBox>

        {InputFiledList.map((field) => (
          <Input
            key={field.name}
            activeField={activeField}
            setActiveField={handleActivateField}
            name={field.name as ActiveField}
            placeholder={field.placeholder}
            value={field.value}
            setValue={field.setValue}
          />
        ))}

        <LoginButton
          type="submit"
          disabled={isPending || !id || !password}
          aria-busy={isPending}
        >
          <LoginText>{isPending ? "로그인 중..." : "로그인"}</LoginText>
        </LoginButton>
      </Content>

      {keyboardVisible && (
        <CustomKeyboard
          text={activeValue}
          setText={setActiveValue}
          setKeyboardVisible={setKeyboardVisible}
          allowedModes={["en", "num"]}
        />
      )}
    </Container>
  );
};

export default KioskLoginPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 280px;
  margin: 0 160px;
  width: calc(100% - 320px);
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
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginText = styled.span`
  color: ${colors.app_white};
  font-size: 40px;
  font-weight: bold;
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 65px;
`;

const Message = styled.span`
  font-size: 50px;
  font-weight: 700;
`;
