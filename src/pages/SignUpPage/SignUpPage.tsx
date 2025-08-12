import { useState } from "react";
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

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cert, setCert] = useState("");
  const [pin, setPin] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("M");
  const [route, setRoute] = useState("가입 경로");

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

  const validateName = (v: string) =>
    v.trim() ? undefined : "이름을 입력해주세요.";
  const validatePhone = (v: string) => {
    const d = digitsOnly(v);
    return d.length === 10 || d.length === 11
      ? undefined
      : "휴대폰 번호를 입력해주세요.";
  };
  const validateCert = (v: string) =>
    digitsOnly(v).length === 6 ? undefined : "인증번호가 올바르지 않습니다.";
  const validatePin = (v: string) =>
    digitsOnly(v).length === 4 ? undefined : "비밀번호를 입력해주세요.";
  const validateBirth = (v: string) =>
    isValidYmd(v) ? undefined : "생년월일을 입력해주세요.";
  const validateRoute = (v: string) =>
    v !== "가입 경로" ? undefined : "가입 경로를 선택해주세요.";
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

  const validateAll = (): Errors => {
    const e: Errors = {};
    const n = validateName(name);
    if (n) e.name = n;
    const p = validatePhone(phone);
    if (p) e.phone = p;
    const c = validateCert(cert);
    if (c) e.cert = c;
    const pi = validatePin(pin);
    if (pi) e.pin = pi;
    const b = validateBirth(birth);
    if (b) e.birth = b;
    const r = validateRoute(route);
    if (r) e.route = r;
    const t = validateTerms(terms);
    if (t) e.terms = t;
    return e;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log("PASS");
    } else {
      console.log("FAILED", v);
    }
  };

  const onChangeName = (v: string) => {
    setName(v);
    if (submitted) setFieldError("name", validateName(v));
  };
  const onChangePhone = (v: string) => {
    setPhone(v);
    if (submitted) setFieldError("phone", validatePhone(v));
  };
  const onChangeCert = (v: string) => {
    const nv = digitsOnly(v).slice(0, 6);
    setCert(nv);
    if (submitted) setFieldError("cert", validateCert(nv));
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

  const onSelectRoute = (v: string) => {
    setRoute(v);
    if (submitted) setFieldError("route", validateRoute(v));
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

  return (
    <Container>
      <GoToHomeButton />
      <Content>
        <Form>
          <InputFileds
            label="이름"
            value={name}
            onChange={onChangeName}
            error={err("name")}
          />

          <InputFileds
            label="휴대폰 번호"
            value={formatPhoneNumber(phone)}
            onChange={onChangePhone}
            inputMode="numeric"
            normalizer={(s) => digitsOnly(s).slice(0, 11)}
            rightSlot={
              <RightButton
                type="button"
                onClick={() => console.log("send code")}
              >
                <RightButtonText>인증 요청</RightButtonText>
              </RightButton>
            }
            error={err("phone")}
          />

          <InputFileds
            label="인증번호"
            value={cert}
            onChange={onChangeCert}
            inputMode="numeric"
            rightSlot={
              <RightButton type="button" onClick={() => console.log("verify")}>
                <RightButtonText>인증하기</RightButtonText>
              </RightButton>
            }
            error={err("cert")}
          />

          <InputFileds
            label="비밀번호 (4자리)"
            value={pin}
            onChange={onChangePin}
            type="password"
            inputMode="numeric"
            error={err("pin")}
          />

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

          <JoinPathAccordion
            route={route}
            setRoute={onSelectRoute}
            paths={[
              "포털 사이트 검색",
              "네이버 플레이스",
              "인스타그램",
              "지인 추천",
            ]}
            error={err("route")}
          />
        </Form>

        <ConsentList
          items={terms}
          onChange={onChangeTerms}
          error={err("terms")}
        />

        <BottomButtons submitName={"회원가입"} submit={handleSubmit} />
      </Content>
    </Container>
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
  padding-top: 200px;
  margin: 0 160px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);
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
