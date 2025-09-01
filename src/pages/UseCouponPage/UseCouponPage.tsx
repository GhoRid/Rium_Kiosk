import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import CodeInput from "./components/CodeInput";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getCouponValid } from "../../apis/api/user";
import { usePriceStore } from "../../stores/usePriceStore";
import BottomButtons from "../../components/BottomButtons";
import CustomKeyboard from "../../components/CustomKeyboard";
import CustomModal from "../../components/CustomModal";
import { useLocation, useNavigate } from "react-router";
import { validateTicketCoupon } from "../../apis/api/pass";

const UseCouponPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false),
    [modalContent, setModalContent] = useState<string>(""),
    [modalSubmitText, setModalSubmitText] = useState<string>("확인");

  const [couponCode, setCouponCode] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const handleCouponCode = (v: string) => {
    const formatted = v.toUpperCase().slice(0, 6);
    setCouponCode(formatted);
  };

  const closeKeyboardOnBackground = () => setKeyboardVisible(false);

  const stop = (e: React.PointerEvent) => e.stopPropagation();

  // From PaymentPage
  const ticketId = usePriceStore((state) => state.ticketId);
  const setPrice = usePriceStore((state) => state.setPrice);
  const setUsingCouponCode = usePriceStore((state) => state.setUsingCouponCode);

  const getCouponValidMutation = useMutation({
    mutationKey: ["fetchUserData", couponCode],
    mutationFn: () => getCouponValid({ token: couponCode, ticketId }),
    onError: (error: any) => {
      if (error.response?.status === 477) {
        setModalContent("유효하지 않은 쿠폰입니다.");
      } else if (error.response?.status === 479) {
        setModalContent("해당 상품에는\n사용할 수 없는 쿠폰입니다.");
      } else if (error.response?.status === 480) {
        setModalContent("이미 사용된 쿠폰입니다.");
      } else {
        setModalContent("쿠폰을 사용할 수 없습니다.");
      }
      if (!isModalOpen) setIsModalOpen(true);
    },
    onSuccess: (data) => {
      const couponName = data.data.couponName;
      const discountedPrice = data.data.discountPrice;
      setPrice(discountedPrice);
      setUsingCouponCode(couponCode);
      setModalContent(`${couponName}\n쿠폰이 적용되었습니다`);
      setIsModalOpen(true);
    },
  });

  const { isError, isSuccess } = getCouponValidMutation;

  // From SelectPassPage
  const validTicketCouponMutation = useMutation({
    mutationKey: ["validTicketCoupon"],
    mutationFn: () => validateTicketCoupon({ token: couponCode }),
  });

  const {
    isError: validTicketCouponIsError,
    isSuccess: validTicketCouponIsSuccess,
    data,
  } = validTicketCouponMutation;

  useEffect(() => {
    if (validTicketCouponIsSuccess) {
      const { couponName, expirationDate, ticketName } = data?.data;
      setModalContent(`${couponName}\n${ticketName}\n\n쿠폰이 적용되었습니다.`);
      setModalSubmitText("이용하기");
      setIsModalOpen(true);
    } else if (validTicketCouponIsError) {
      setModalContent("쿠폰을 사용할 수 없습니다.");
      setIsModalOpen(true);
    }
  }, [validTicketCouponIsError, validTicketCouponIsSuccess]);

  const handleSubmit = () => {
    if (from == "/payment") {
      getCouponValidMutation.mutate();
    } else if (from == "/selectpass") {
      validTicketCouponMutation.mutate();
    }
  };

  const handleModalAction = () => {
    if (from == "/payment") {
      if (isSuccess) {
        setIsModalOpen(false);
        navigate(-1);
      } else if (isError) {
        setIsModalOpen(false);
      }
    } else if (from == "/selectpass") {
      if (validTicketCouponIsSuccess) {
        setIsModalOpen(false);
        navigate("/select-seat", {
          state: { couponData: couponCode, from: "/usecoupon" },
        });
      } else if (validTicketCouponIsError) {
        setIsModalOpen(false);
      }
    }
  };

  return (
    <>
      <Container onPointerDown={closeKeyboardOnBackground}>
        <GoToHomeButton />
        <Header title="쿠폰 이용하기" />

        <Content>
          <Title>쿠폰 번호 입력</Title>

          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              setKeyboardVisible(true);
            }}
          >
            <CodeInput
              placeholder="쿠폰 번호(6자리)"
              value={couponCode}
              setValue={handleCouponCode}
            />
          </div>
        </Content>

        <BottomButtons submitName="확인" submit={handleSubmit} />

        {keyboardVisible && (
          <KeyboardWrap onPointerDown={stop}>
            <CustomKeyboard
              text={couponCode}
              setText={handleCouponCode}
              setKeyboardVisible={setKeyboardVisible}
              layoutNameProp="shift"
              allowedModes={["en", "num"]}
            />
          </KeyboardWrap>
        )}
      </Container>

      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalContent={modalContent}
        submitText={modalSubmitText}
        submitAction={handleModalAction}
      />
    </>
  );
};

export default UseCouponPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  margin: 0 160px;
  padding-top: 350px;
  display: flex;
  flex-direction: column;
  gap: 100px;
  width: calc(100% - 320px);
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: 700;
  text-align: center;
`;

const KeyboardWrap = styled.div``;
