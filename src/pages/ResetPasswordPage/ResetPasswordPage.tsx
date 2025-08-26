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
  resetPassword,
  sendSmsCode,
  verifySmsCode,
} from "../../apis/api/user";
import { useNavigate } from "react-router";
import CustomModal from "../../components/CustomModal";
import CustomKeyboard from "../../components/CustomKeyboard"; // ✅ 추가

export type FieldName =
  | "name"
  | "phone"
  | "birth"
  | "code"
  | "newPassword"
  | "checkNewPasswordd";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [activeField, setActiveField] = useState<FieldName>("name");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // 숫자만 저장
  const [birth, setBirth] = useState(""); // YYYYMMDD (숫자만)
  const [code, setCode] = useState(""); // 인증번호
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isPresentUser, setIsPresentUser] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [checkNewPasswordd, setCheckNewPasswordd] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [submitName, setSubmitName] = useState<string>("가입 정보 확인");

  // ✅ 키보드 상태 & 핸들러
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const closeKeyboardOnBackground = () => {
    setKeyboardVisible(false);
    setActiveField("name"); // 필요하면 null로 바꿔도 됨
  };
  const stop = (e: React.PointerEvent) => e.stopPropagation();
  const open = (f: FieldName) => (e: React.PointerEvent) => {
    e.stopPropagation();
    setActiveField(f);
    setKeyboardVisible(true);
  };

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
    if (isCodeVerified && submitted == false) {
      checkMembershipMutation.mutate();
    } else if (submitted) {
      resetPasswordMutation.mutate();
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
  const onChangeNewPassword = (v: string) => {
    const next = v.slice(0, 4);
    setNewPassword(next);
  };
  const onChangeCheckNewPassword = (v: string) => {
    const next = v.slice(0, 4);
    setCheckNewPasswordd(next);
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
    onSuccess: () => {
      {
        setSubmitName("비밀번호 재설정");
        setIsPresentUser(true);
      }
    },
    onError: (e: any) => {
      setFieldError("birth", e?.message || "회원 정보 확인에 실패했습니다.");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["resetPassword", digitsOnly(phone), newPassword],
    mutationFn: () =>
      resetPassword({
        mobileNumber: digitsOnly(phone),
        newPassword,
      }),
    onSuccess: () => {
      setIsModalVisible(true);
    },
    onError: (e: any) => {
      setFieldError(
        "newPassword",
        e?.message || "비밀번호 재설정에 실패했습니다."
      );
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
            onPointerDown={
              (e) => e.stopPropagation() /* 키보드 열림/닫힘 방지 */
            }
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
        ),
      },
    ],
    [
      name,
      phone,
      birth,
      submitted,
      errors,
      code,
      isCodeVerified,
      canRequestCode,
      canVerifyCode,
      sendCodeMutation.isPending,
      verifyCodeMutation.isPending,
    ]
  );

  // ✅ 키보드 바인딩: 현재 활성 필드의 값/세터/모드
  const fieldVals = {
    name,
    phone,
    birth,
    code,
    newPassword,
    checkNewPasswordd,
  } as const;
  const fieldSetters = {
    name: onChangeName,
    phone: onChangePhone,
    birth: onChangeBirth,
    code: onChangeCode,
    newPassword: onChangeNewPassword,
    checkNewPasswordd: onChangeCheckNewPassword,
  } as const;
  const kbdText = activeField ? fieldVals[activeField] : "";
  const kbdSetter = activeField ? fieldSetters[activeField] : (v: string) => {};
  const kbdModes =
    activeField === "name" ? (["kr", "en"] as const) : (["num"] as const);

  return (
    <>
      {/* ✅ 배경 탭 시 키보드 닫힘 */}
      <Container onPointerDown={closeKeyboardOnBackground}>
        <GoToHomeButton />
        <Header title="비밀번호 재설정" />

        {/* 내부 클릭은 전파 막기 */}
        <Content onPointerDown={stop}>
          {InputFiledList.map((field) => (
            <PointerBlocker key={field.name} onPointerDown={open(field.name)}>
              <InputFiled
                activeField={activeField}
                setActiveField={setActiveField}
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                setValue={field.setValue}
                rightSlot={field.rightSlot}
              />
            </PointerBlocker>
          ))}
          {isPresentUser && (
            <>
              <PointerBlocker onPointerDown={open("newPassword")}>
                <InputFiled
                  key={"newPassword"}
                  activeField={activeField}
                  setActiveField={setActiveField}
                  name={"newPassword"}
                  placeholder={"비밀번호 재설정 (4자리)"}
                  value={newPassword}
                  setValue={onChangeNewPassword}
                />
              </PointerBlocker>
              <PointerBlocker onPointerDown={open("newPassword")}>
                <InputFiled
                  key={"checkNewPassword"}
                  activeField={activeField}
                  setActiveField={setActiveField}
                  name={"newPassword"}
                  placeholder={"비밀번호 확인 (4자리)"}
                  value={checkNewPasswordd}
                  setValue={onChangeCheckNewPassword}
                />
              </PointerBlocker>
            </>
          )}
        </Content>

        {Object.keys(errors).length > 0 && (
          <ErrorMsg>정보를 다시 입력해주세요.</ErrorMsg>
        )}

        <PointerBlocker onPointerDown={stop}>
          <BottomButtons submitName={submitName} submit={handleSubmit} />
        </PointerBlocker>

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
        isModalOpen={isModalVisible}
        setIsModalOpen={setIsModalVisible}
        modalContent="비밀번호가 변경되었습니다."
        submitText="홈으로"
        submitAction={() => {
          setIsModalVisible(false);
          navigate("/home");
        }}
        isCloseIconVisible={false}
      />
    </>
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
const PointerBlocker = styled.div`
  width: 100%;
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

const KeyboardWrap = styled.div``;
