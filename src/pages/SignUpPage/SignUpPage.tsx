import { useState, useMemo } from "react";
import styled from "styled-components";
import InputFileds from "./components/InputFileds";
import RadioGroup from "./components/RadioGroup";
import { colors } from "../../colors";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import ConsentList from "./components/ConsentList";
import { formatDateHyphen } from "../../utils/formatDate";
import GoToHomeButton from "../../components/GoToHomeButton";
import BottomButtons from "../../components/BottomButtons";
import { useMutation } from "@tanstack/react-query";
import { registerUser, sendSmsCode, verifySmsCode } from "../../apis/api/user";
import SignUpSuccessModal from "./components/SignUpSuccessModal";
import { useNavigate } from "react-router";
import CustomKeyboard from "../../components/CustomKeyboard";
import CustomModal from "../../components/CustomModal";

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
  pinConfirm: string;
  birth: string;
  route: string;
  terms: string;
}>;
type ActiveField =
  | "name"
  | "phone"
  | "cert"
  | "pin"
  | "pinConfirm"
  | "birth"
  | null;

const SignUpPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [cert, setCert] = useState(""),
    [pin, setPin] = useState(""),
    [pinConfirm, setPinConfirm] = useState(""),
    [birth, setBirth] = useState("");
  const [gender, setGender] = useState<string>("M");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    text: "",
    submitAction: () => {},
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);

  // 배경 탭 → 키보드 닫기
  const closeKeyboardOnBackground = () => {
    setKeyboardVisible(false);
    setActiveField(null);
  };
  const stop = (e: React.PointerEvent) => e.stopPropagation();
  const open = (f: ActiveField) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveField(f);
    setKeyboardVisible(true);
  };

  // Validators
  const vName = (v: string) => (v.trim() ? undefined : "이름을 입력해주세요.");
  const vPhone = (v: string) => {
    const d = digitsOnly(v);
    return d.length === 10 || d.length === 11
      ? undefined
      : "휴대폰 번호를 입력해주세요.";
  };
  const vCert = (v: string) =>
    digitsOnly(v).length === 6 ? undefined : "인증번호가 올바르지 않습니다.";
  const vPin = (v: string) =>
    digitsOnly(v).length === 4 ? undefined : "비밀번호를 입력해주세요.";
  const vPinConfirm = (v: string) => {
    const d = digitsOnly(v);
    if (d.length !== 4) return "비밀번호를 입력해주세요.";
    if (d !== digitsOnly(pin)) return "비밀번호가 일치하지 않습니다.";
    return undefined;
  };
  const vBirth = (v: string) => {
    const s = digitsOnly(v);
    if (s.length !== 8) return "생년월일을 8자리로 입력해주세요 (YYYYMMDD)";
    const y = +s.slice(0, 4),
      m = +s.slice(4, 6),
      d = +s.slice(6, 8);
    const now = new Date(),
      CY = now.getFullYear();
    if (y < 1900 || y > CY) return "올바른 연도를 입력해주세요";
    if (m < 1 || m > 12) return "올바른 월을 입력해주세요 (01-12)";
    const last = new Date(y, m, 0).getDate();
    if (d < 1 || d > last) return "올바른 일을 입력해주세요";
    if (new Date(y, m - 1, d) > now) return "미래 날짜는 입력할 수 없습니다";
    return undefined;
  };
  const vTerms = (arr: TermItem[]) =>
    arr.every((t) => !t.required || t.checked)
      ? undefined
      : "필수 약관에 동의해주세요.";
  const setFieldError = (key: keyof Errors, msg?: string) =>
    setErrors((prev) =>
      msg ? { ...prev, [key]: msg } : (delete (prev as any)[key], { ...prev })
    );

  // onChange 압축 헬퍼
  const mk =
    <K extends keyof Errors>(
      setter: (v: string) => void,
      key: K,
      validator: (v: string) => string | undefined,
      normalize?: (s: string) => string,
      resetVerify?: boolean
    ) =>
    (v: string) => {
      const nv = normalize ? normalize(v) : v;
      setter(nv);
      if (resetVerify) setIsCodeVerified(false);
      if (submitted) setFieldError(key, validator(nv));
    };

  const onChangeName = mk(setName, "name", vName);
  const onChangePhone = mk(
    setPhone,
    "phone",
    vPhone,
    (s) => digitsOnly(s).slice(0, 11),
    true
  );
  const onChangeCert = mk(
    setCert,
    "cert",
    vCert,
    (s) => digitsOnly(s).slice(0, 6),
    true
  );
  const onChangePin = mk(setPin, "pin", vPin, (s) => digitsOnly(s).slice(0, 4));
  const onChangePinConfirm = mk(setPinConfirm, "pinConfirm", vPinConfirm, (s) =>
    digitsOnly(s).slice(0, 4)
  );
  const onChangeBirth = mk(setBirth, "birth", vBirth);

  // Mutations
  const sendCodeMutation = useMutation({
    mutationFn: async () => sendSmsCode({ mobileNumber: digitsOnly(phone) }),
    onSuccess: () => {},
    onError: (e: any) =>
      setFieldError("phone", e?.message || "인증 요청에 실패했습니다."),
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
    mutationFn: async () =>
      registerUser({
        mobileNumber: digitsOnly(phone),
        password: pin,
        name,
        birth,
      }),
    onSuccess: () => {
      setModalContent({
        text: `${name}님\n회원가입이 완료되었습니다.`,
        submitAction: () => {
          setIsModalOpen(false);
          navigate("/home", { replace: true });
        },
      });
      setIsModalOpen(true);
    },
    onError: (err: any) => {
      if (err.status === 409) {
        setModalContent({
          text: "이미 가입된 계정입니다.",
          submitAction: () => {
            setIsModalOpen(false);
          },
        });
      }
      setIsModalOpen(true);
    },
  });

  // Derived
  const canRequestCode = useMemo(() => {
    const len = digitsOnly(phone).length;
    return (len === 10 || len === 11) && !sendCodeMutation.isPending;
  }, [phone, sendCodeMutation.isPending]);
  const canVerifyCode = useMemo(
    () => digitsOnly(cert).length === 6 && !verifyCodeMutation.isPending,
    [cert, verifyCodeMutation.isPending]
  );

  // Submit
  const validateAll = (): Errors => {
    const e: Errors = {};
    const n = vName(name);
    if (n) e.name = n;
    const p = vPhone(phone);
    if (p) e.phone = p;
    const c = vCert(cert);
    if (c) e.cert = c;
    const pi = vPin(pin);
    if (pi) e.pin = pi;
    const pic = vPinConfirm(pinConfirm);
    if (pic) e.pinConfirm = pic;
    const b = vBirth(birth);
    if (b) e.birth = b;
    const t = vTerms(terms);
    if (t) e.terms = t;
    return e;
  };
  const handleSubmit = () => {
    setSubmitted(true);
    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length === 0) registerUserMutation.mutate();
  };

  // 키보드 바인딩 맵
  const fieldVals = { name, phone, cert, pin, pinConfirm, birth } as const;
  const fieldSetters = {
    name: onChangeName,
    phone: onChangePhone,
    cert: onChangeCert,
    pin: onChangePin,
    pinConfirm: onChangePinConfirm,
    birth: onChangeBirth,
  } as const;
  const kbdText = activeField ? fieldVals[activeField] : "";
  const kbdSetter = activeField ? fieldSetters[activeField] : (v: string) => {};
  const kbdModes =
    activeField === "name" ? (["kr", "en"] as const) : (["num"] as const);
  const err = <K extends keyof Errors>(k: K) =>
    submitted ? errors[k] : undefined;

  return (
    <>
      <Container onPointerDown={closeKeyboardOnBackground}>
        <GoToHomeButton />
        <Content onPointerDown={stop}>
          <Form>
            <div onPointerDown={open("name")}>
              <InputFileds
                label="이름"
                value={name}
                onChange={onChangeName}
                error={err("name")}
              />
            </div>

            <div onPointerDown={open("phone")}>
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
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <RightButtonText>
                      {sendCodeMutation.isPending ? "요청중..." : "인증 요청"}
                    </RightButtonText>
                  </RightButton>
                }
                error={err("phone")}
              />
            </div>

            <div onPointerDown={open("cert")}>
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
                    onPointerDown={(e) => e.stopPropagation()}
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

            <div onPointerDown={open("pin")}>
              <InputFileds
                label="비밀번호 (4자리)"
                value={pin}
                onChange={onChangePin}
                type="password"
                inputMode="numeric"
                error={err("pin")}
              />
            </div>
            <div onPointerDown={open("pinConfirm")}>
              <InputFileds
                label="비밀번호 재입력 (4자리)"
                value={pinConfirm}
                onChange={onChangePinConfirm}
                type="password"
                inputMode="numeric"
                error={err("pinConfirm")}
              />
            </div>

            <div onPointerDown={open("birth")}>
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
            onChange={(updater: any) => {
              setTerms((prev) => {
                const next =
                  typeof updater === "function"
                    ? (updater as any)(prev)
                    : updater;
                if (submitted) setFieldError("terms", vTerms(next));
                return next;
              });
            }}
            error={err("terms")}
          />

          <BottomButtons submitName="회원가입" submit={handleSubmit} />
        </Content>

        {keyboardVisible && activeField && (
          <KeyboardWrap onPointerDown={stop}>
            <CustomKeyboard
              text={kbdText}
              setText={kbdSetter}
              setKeyboardVisible={setKeyboardVisible}
              allowedModes={[...kbdModes]}
              initialMode={kbdModes[0]}
            />
          </KeyboardWrap>
        )}
      </Container>

      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalContent={modalContent.text}
        submitText="확인"
        isCloseIconVisible={false}
        submitAction={() => modalContent.submitAction}
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
const KeyboardWrap = styled.div``; // 기존 동작 그대로 유지
