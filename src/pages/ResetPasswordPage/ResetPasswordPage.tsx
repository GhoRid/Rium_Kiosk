import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import { colors } from "../../colors";
import { useMemo, useState } from "react";
import { digitsOnly, formatPhoneNumber } from "../../utils/formatPhoneNumber";
import InputFiled from "./components/InputFiled";
import BottomButtons from "../../components/BottomButtons";
import { isValidYmd } from "../../utils/checkValide";
import { formatDateHyphen } from "../../utils/formatDate";
import ErrorMsg from "../../components/ErrorMsg";
import Header from "../../components/Header";
import { useMutation } from "@tanstack/react-query";
import {
  checkMembership,
  sendSmsCode,
  verifySmsCode,
} from "../../apis/api/user";

const ResetPasswordPage = () => {
  type FieldName = "name" | "phone" | "birth" | "code" | "newPassword";

  const [activeField, setActiveField] = useState<FieldName>("name");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // 숫자만 저장
  const [birth, setBirth] = useState(""); // YYYYMMDD (숫자만)
  const [code, setCode] = useState(""); // 인증번호
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const validateName = (v: string) =>
    v.trim() ? undefined : "이름을 입력해주세요.";

  const validatePhone = (v: string) => {
    const d = digitsOnly(v);
    return d.length === 10 || d.length === 11
      ? undefined
      : "휴대폰 번호를 입력해주세요.";
  };

  const validateBirth = (v: string) =>
    isValidYmd(v) ? undefined : "생년월일을 입력해주세요.";

  const validateCode = (v: string) =>
    v.length === 6 ? undefined : "인증번호를 입력해주세요.";

  const setFieldError = (key: FieldName, msg?: string) => {
    setErrors((prev) => {
      if (msg) return { ...prev, [key]: msg };
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateAll = () => {
    const e: Partial<Record<FieldName, string>> = {};
    const n = validateName(name);
    if (n) e.name = n;
    const p = validatePhone(phone);
    if (p) e.phone = p;
    const b = validateBirth(birth);
    if (b) e.birth = b;
    const c = validateCode(code);
    if (c) e.code = c;
    return e;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length === 0 && isCodeVerified) {
      checkMembershipMutation.mutate();
      // api 로직 추가
    } else {
      // console.log("FAILED", v);
    }
  };

  const onChangeName = (v: string) => {
    const next = v.slice(0, 20);
    setName(next);
    if (submitted) setFieldError("name", validateName(next));
  };

  const onChangePhone = (v: string) => {
    const next = digitsOnly(v).slice(0, 11);
    setPhone(next);
    if (submitted) setFieldError("phone", validatePhone(next));
  };

  const onChangeBirth = (v: string) => {
    const next = digitsOnly(v).slice(0, 8);
    setBirth(next);
    if (submitted) setFieldError("birth", validateBirth(next));
  };

  const onChangeCode = (v: string) => {
    const next = digitsOnly(v).slice(0, 6);
    setCode(next);
    // if (submitted) setFieldError("code", validateCode(next));
  };

  const sendCodeMutation = useMutation({
    mutationKey: ["sendSmsCode", digitsOnly(phone), "resetPassword"],
    mutationFn: async () => sendSmsCode({ mobileNumber: digitsOnly(phone) }),
    onSuccess: () => {},
    onError: (e: any) => {
      setFieldError("phone", e?.message || "인증 요청에 실패했습니다.");
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async () =>
      verifySmsCode({
        mobileNumber: digitsOnly(phone),
        code: digitsOnly(code),
      }),
    onSuccess: () => {
      setIsCodeVerified(true);
      setFieldError("code", undefined);
    },
    onError: (e: any) => {
      setIsCodeVerified(false);
      setFieldError("code", e?.message || "인증번호가 일치하지 않습니다.");
    },
  });

  const checkMembershipMutation = useMutation({
    mutationKey: [
      "checkMembership",
      name,
      digitsOnly(phone),
      digitsOnly(birth),
    ],
    mutationFn: () =>
      checkMembership({
        name: name,
        mobileNumber: digitsOnly(phone),
        birth: digitsOnly(birth),
      }),
    onSuccess: () => {},
    onError: (e: any) => {
      setFieldError("birth", e?.message || "회원 정보 확인에 실패했습니다.");
    },
  });

  const canRequestCode = useMemo(() => {
    const len = digitsOnly(phone).length;
    return (len === 10 || len === 11) && !sendCodeMutation.isPending;
  }, [phone, sendCodeMutation.isPending]);

  const canVerifyCode = useMemo(
    () => digitsOnly(code).length === 6 && !verifyCodeMutation.isPending,
    [code, verifyCodeMutation.isPending]
  );

  console.log(checkMembershipMutation.data);
  const InputFiledList = useMemo(
    () => [
      {
        name: "name" as FieldName,
        placeholder: "이름",
        value: name,
        setValue: onChangeName,
        error: submitted ? errors.name : undefined,
      },
      {
        name: "birth" as FieldName,
        placeholder: "생년월일(YYYYMMDD)",
        value: formatDateHyphen(birth),
        setValue: onChangeBirth,
        error: submitted ? errors.birth : undefined,
      },
      {
        name: "phone" as FieldName,
        placeholder: "휴대폰 번호",
        value: formatPhoneNumber(phone),
        setValue: onChangePhone,
        error: submitted ? errors.phone : undefined,
        rightSlot: (
          <RightButton
            type="button"
            disabled={!canRequestCode}
            onClick={() => sendCodeMutation.mutate()}
          >
            <RightButtonText>
              {sendCodeMutation.isPending ? "요청중..." : "인증 요청"}
            </RightButtonText>
          </RightButton>
        ),
      },
      {
        name: "code" as FieldName,
        placeholder: "인증하기",
        value: code,
        setValue: onChangeCode,
        error: submitted ? errors.code : undefined,
        rightSlot: (
          <RightButton
            type="button"
            disabled={!canVerifyCode || isCodeVerified}
            onClick={() => verifyCodeMutation.mutate()}
          >
            <RightButtonText>
              {isCodeVerified
                ? "완료"
                : verifyCodeMutation.isPending
                ? "확인중..."
                : "인증하기"}
            </RightButtonText>
          </RightButton>
        ),
      },
    ],
    [name, phone, birth, submitted, errors, code]
  );

  return (
    <Container>
      <GoToHomeButton />
      <Header title="비밀번호 재설정" />
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
            rightSlot={field.rightSlot}
          />
        ))}
      </Content>
      {checkMembershipMutation.data && (
        <InputFiled
          key={"newPassword"}
          activeField={activeField}
          setActiveField={setActiveField}
          name={"newPassword"}
          placeholder={"비밀번호 재설정 (4자리)"}
          value={newPassword}
          setValue={setNewPassword}
        />
      )}

      {Object.keys(errors).length > 0 && (
        <ErrorMsg>정보를 다시 입력해주세요.</ErrorMsg>
      )}
      <BottomButtons submitName="가입 정보 확인" submit={handleSubmit} />
    </Container>
  );
};

export default ResetPasswordPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  margin: 0 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: calc(100% - 320px);
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
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
`;

const RightButtonText = styled.span`
  font-size: 32px;
  color: ${colors.app_white};
  cursor: pointer;
`;
