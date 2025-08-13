import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import { colors } from "../../colors";
import { useMemo, useState } from "react";
import { digitsOnly, formatPhoneNumber } from "../../utils/formatPhoneNumber";
import InputFiled from "./components/InputFiled";
import BottomButtons from "../../components/BottomButtons";
import { isValidYmd } from "../../utils/checkValide";
import { formatDateHyphen } from "../../utils/formatDate";

const ResetPasswordPage = () => {
  type FieldName = "name" | "phone" | "birth";

  const [activeField, setActiveField] = useState<FieldName>("name");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // 숫자만 저장
  const [birth, setBirth] = useState(""); // YYYYMMDD (숫자만)

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
    return e;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const v = validateAll();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      console.log("PASS");
      // api 로직 추가
    } else {
      console.log("FAILED", v);
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
        name: "phone" as FieldName,
        placeholder: "휴대폰 번호",
        value: formatPhoneNumber(phone),
        setValue: onChangePhone,
        error: submitted ? errors.phone : undefined,
      },
      {
        name: "birth" as FieldName,
        placeholder: "생년월일(YYYYMMDD)",
        value: formatDateHyphen(birth),
        setValue: onChangeBirth,
        error: submitted ? errors.birth : undefined,
      },
    ],
    [name, phone, birth, submitted, errors]
  );

  {
    /* "입력하신 정보로 가입한 기록이 없어요.\n철자나 번호를 다시 확인해주세요." */
  }

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

        {Object.keys(errors).length > 0 && (
          <ErrorMsgBox>
            <ErrorMsg>{"정보를 다시 입력해주세요."}</ErrorMsg>
          </ErrorMsgBox>
        )}
      </Content>
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

const ErrorMsgBox = styled.div`
  margin-top: 500px;
`;

const ErrorMsg = styled.p`
  color: ${colors.red};
  font-size: 24px;
  white-space: pre-wrap;
  text-align: center;
`;
