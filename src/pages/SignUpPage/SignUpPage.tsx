import { useState, useMemo } from "react";
import styled from "styled-components";
import InputFileds from "./components/InputFileds";
import RadioGroup from "./components/RadioGroup";
import { colors } from "../../colors";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import ConsentList from "./components/ConsentList";
import { formatDateHyphen } from "../../utils/formatDate";
import JoinPathAccordion from "./components/JoinPathAccordion";
import GoToHomeButton from "../../components/GoToHomeButton";
import BottomButtons from "../../components/BottomButtons";
import { isValidYmd } from "../../utils/checkValide";
import { useMutation } from "@tanstack/react-query";
import { registerUser, sendSmsCode, verifySmsCode } from "../../apis/api/user";
import SignUpSuccessModal from "./components/SignUpSuccessModal";
import { useNavigate } from "react-router";
import CustomKeyboard from "../../components/CustomKeyboard";

const digitsOnly = (s: string) => s.replace(/\D/g, "");
const fmtBirth = (v: string) => digitsOnly(v).slice(0, 8);

type TermItem = {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
};

type Errors = Partial<{
  name: string;
  phone: string;
  cert: string;
  pin: string;
  birth: string;
  route: string;
  terms: string;
}>;

type ActiveField = "name" | "phone" | "cert" | "pin" | "birth" | null;

const SignUpPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cert, setCert] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const [pin, setPin] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("M");

  const [terms, setTerms] = useState<TermItem[]>([
    {
      id: "tos",
      label: "서비스 이용약관 동의",
      required: true,
      checked: false,
    },
    {
      id: "privacy",
      label: "개인정보 활용 동의",
      required: true,
      checked: false,
    },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const validateName = (v: string) =>
    v.trim() ? undefined : "이름을 입력해주세요.";
  const validatePhone = (v: string) => {
    const d = digitsOnly(v);
    return d.length === 10 || d.length === 11
      ? undefined
      : "휴대폰 번호를 입력해주세요.";
  };
  const validateCertLength = (v: string) =>
    digitsOnly(v).length === 6 ? undefined : "인증번호가 올바르지 않습니다.";
  const validatePin = (v: string) =>
    digitsOnly(v).length === 4 ? undefined : "비밀번호를 입력해주세요.";
  const validateBirth = (v: string) => {
    const s = v.replace(/\D/g, "");
    if (s.length !== 8) return "생년월일을 8자리로 입력해주세요 (YYYYMMDD)";

    const year = Number(s.slice(0, 4));
    const month = Number(s.slice(4, 6));
    const day = Number(s.slice(6, 8));

    const now = new Date();
    const currentYear = now.getFullYear();

    if (year < 1900 || year > currentYear) return "올바른 연도를 입력해주세요";

    if (month < 1 || month > 12) return "올바른 월을 입력해주세요 (01-12)";

    const lastDay = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDay) return "올바른 일을 입력해주세요";

    const birthDate = new Date(year, month - 1, day);
    if (birthDate > now) return "미래 날짜는 입력할 수 없습니다";

    return undefined;
  };
  const validateTerms = (arr: TermItem[]) =>
    arr.every((t) => !t.required || t.checked)
      ? undefined
      : "필수 약관에 동의해주세요.";

  const setFieldError = (key: keyof Errors, msg?: string) => {
    setErrors((prev) => {
      if (msg) return { ...prev, [key]: msg };
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const sendCodeMutation = useMutation({
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
        code: digitsOnly(cert),
      }),
    onSuccess: () => {
      setIsCodeVerified(true);
      setFieldError("cert", undefined);
    },
    onError: (e: any) => {
      setIsCodeVerified(false);
      setFieldError("cert", e?.message || "인증번호가 일치하지 않습니다.");
    },
  });

  const registerUserMutation = useMutation({
    mutationFn: async () => {
      registerUser({
        mobileNumber: digitsOnly(phone),
        password: pin,
        name: name,
        birth: birth,
      });
    },
    onSuccess: () => {
      setIsModalOpen(true);
    },
    onError: (e: any) => {
      console.error("회원가입 실패:", e);
    },
  });

  const canRequestCode = useMemo(() => {
    const len = digitsOnly(phone).length;
    return (len === 10 || len === 11) && !sendCodeMutation.isPending;
  }, [phone, sendCodeMutation.isPending]);

  const canVerifyCode = useMemo(
    () => digitsOnly(cert).length === 6 && !verifyCodeMutation.isPending,
    [cert, verifyCodeMutation.isPending]
  );

  const validateAll = (): Errors => {
    const e: Errors = {};
    const n = validateName(name);
    if (n) e.name = n;
    const p = validatePhone(phone);
    if (p) e.phone = p;
    const c = validateCertLength(cert);
    if (c) e.cert = c;
    const pi = validatePin(pin);
    if (pi) e.pin = pi;
    const b = validateBirth(birth);
    if (b) e.birth = b;
    const t = validateTerms(terms);
    if (t) e.terms = t;
    return e;
  };
  const handleSubmit = () => {
    setSubmitted(true);
    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      registerUserMutation.mutate();
    }
  };

  const onChangeName = (v: string) => {
    setName(v);
    if (submitted) setFieldError("name", validateName(v));
  };

  const onChangePhone = (v: string) => {
    const d = digitsOnly(v).slice(0, 11);
    setPhone(d);
    if (isCodeVerified) setIsCodeVerified(false);
    if (submitted) setFieldError("phone", validatePhone(d));
  };

  const onChangeCert = (v: string) => {
    const nv = digitsOnly(v).slice(0, 6);
    setCert(nv);
    if (isCodeVerified) setIsCodeVerified(false);
    if (submitted) setFieldError("cert", validateCertLength(nv));
  };

  const onChangePin = (v: string) => {
    const nv = digitsOnly(v).slice(0, 4);
    setPin(nv);
    if (submitted) setFieldError("pin", validatePin(nv));
  };

  const onChangeBirth = (v: string) => {
    setBirth(v);
    if (submitted) setFieldError("birth", validateBirth(v));
  };

  const onChangeTerms: React.Dispatch<React.SetStateAction<TermItem[]>> = (
    updater
  ) => {
    setTerms((prev) => {
      const next =
        typeof updater === "function" ? (updater as any)(prev) : updater;
      if (submitted) setFieldError("terms", validateTerms(next));
      return next;
    });
  };

  const err = <K extends keyof Errors>(k: K) =>
    submitted ? errors[k] : undefined;

  const openKeyboard = (f: ActiveField) => {
    setActiveField(f);
    setKeyboardVisible(true);
  };

  const kbdText =
    activeField === "name"
      ? name
      : activeField === "phone"
      ? phone
      : activeField === "cert"
      ? cert
      : activeField === "pin"
      ? pin
      : activeField === "birth"
      ? birth
      : "";

  const kbdSetter =
    activeField === "name"
      ? onChangeName
      : activeField === "phone"
      ? onChangePhone
      : activeField === "cert"
      ? onChangeCert
      : activeField === "pin"
      ? onChangePin
      : activeField === "birth"
      ? onChangeBirth
      : (v: string) => {};

  const kbdModes =
    activeField === "name" ? (["kr", "en"] as const) : (["num"] as const);

  return (
    <>
      <Container>
        <GoToHomeButton />
        <Content>
          <Form>
            <div onPointerDown={() => openKeyboard("name")}>
              <InputFileds
                label="이름"
                value={name}
                onChange={onChangeName}
                error={err("name")}
              />
            </div>

            <div onPointerDown={() => openKeyboard("phone")}>
              <InputFileds
                label="휴대폰 번호"
                value={formatPhoneNumber(phone)}
                onChange={onChangePhone}
                inputMode="numeric"
                normalizer={(s) => digitsOnly(s).slice(0, 11)}
                rightSlot={
                  <RightButton
                    type="button"
                    disabled={!canRequestCode}
                    onClick={() => sendCodeMutation.mutate()}
                  >
                    <RightButtonText>
                      {sendCodeMutation.isPending ? "요청중..." : "인증 요청"}
                    </RightButtonText>
                  </RightButton>
                }
                error={err("phone")}
              />
            </div>

            <div onPointerDown={() => openKeyboard("cert")}>
              <InputFileds
                label={`인증번호${isCodeVerified ? " (인증 완료)" : ""}`}
                value={cert}
                onChange={onChangeCert}
                inputMode="numeric"
                rightSlot={
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
                }
                error={err("cert")}
              />
            </div>

            <div onPointerDown={() => openKeyboard("pin")}>
              <InputFileds
                label="비밀번호 (4자리)"
                value={pin}
                onChange={onChangePin}
                type="password"
                inputMode="numeric"
                error={err("pin")}
              />
            </div>

            <div onPointerDown={() => openKeyboard("birth")}>
              <InputFileds
                label="생년월일(YYYYMMDD)"
                value={formatDateHyphen(birth)}
                onChange={onChangeBirth}
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
                error={err("birth")}
              />
            </div>
          </Form>

          <ConsentList
            items={terms}
            onChange={onChangeTerms}
            error={err("terms")}
          />

          <BottomButtons submitName={"회원가입"} submit={handleSubmit} />
        </Content>

        {keyboardVisible && activeField && (
          <CustomKeyboard
            text={kbdText}
            setText={kbdSetter}
            setKeyboardVisible={setKeyboardVisible}
            allowedModes={[...kbdModes]}
            initialMode={kbdModes[0]}
          />
        )}
      </Container>

      <SignUpSuccessModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        submitAction={() => {
          setIsModalOpen(false);
          navigate("/login", { replace: true });
        }}
      />
    </>
  );
};

export default SignUpPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 400px;
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
