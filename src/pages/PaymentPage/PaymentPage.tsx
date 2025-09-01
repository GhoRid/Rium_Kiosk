import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import PaymentInfo from "./components/PaymentInfo";
import PaymentMethod from "./components/PaymentMethod";
import PaymentOptionSelector from "./components/PaymentOptionSelector";
import PrintSetting from "./components/PrintSetting";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import PayAnimationModal from "./components/PayAnimationModal";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { getUserId } from "../../utils/tokens";
import { useRunPaymentFlow } from "./useRunPaymentFlow";
import { usePriceStore } from "../../stores/usePriceStore";

type PaymentType =
  | "credit"
  | "credit_fallback"
  | "credit_cancel"
  | "kakao_money";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { price, passType, label, seatType, seatNumber, ticketId } =
    location.state || {};

  const passTicketVisible = !!seatNumber;

  const userId = useMemo(() => getUserId(), []);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null),
    [paymentType, setPaymentType] = useState<PaymentType>("credit"),
    [installment, setInstallment] = useState<string>("일시불"),
    [selectedInstallmentOption, setSelectedInstallmentOption] =
      useState<number>(0);

  const [printPass, setPrintPass] = useState<boolean>(true),
    [printReceipt, setPrintReceipt] = useState<boolean>(true);
  const [labelName, setLabelName] = useState<string>(label);
  const [finalPrice, setFinalPrice] = useState<number>(price);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const discountedPrice = usePriceStore((state) => state.price);
  const usingCouponCode = usePriceStore((state) => state.usingCouponCode);
  const setTicketId = usePriceStore((state) => state.setTicketId);
  const setPrice = usePriceStore((state) => state.setPrice);
  const setUsingCouponCode = usePriceStore((state) => state.setUsingCouponCode);

  // console.log("usingCouponCode", usingCouponCode);
  // console.log("discountedPrice", discountedPrice);

  // 페이지 언마운트 시 할인 가격, 사용중인 쿠폰 코드 초기화
  useEffect(() => {
    return () => {
      setPrice(null);
      setUsingCouponCode(null);
      console.log("PaymentPage unmounted, store reset");
    };
  }, [setPrice, setUsingCouponCode]);

  // ticketId가 변경되면 store에 업데이트
  useEffect(() => {
    setTicketId(ticketId);
  }, [ticketId, setTicketId]);

  // 할인 가격이 유효하면 finalPrice와 labelName 업데이트
  useEffect(() => {
    if (discountedPrice !== null && discountedPrice <= price) {
      setFinalPrice(discountedPrice);
      setLabelName(`${label} (쿠폰 적용)`);
    }
  }, [discountedPrice, price, label]);

  // 결제 수단에 따라 paymentType 설정
  useEffect(() => {
    if (["카드", "삼성페이"].includes(paymentMethod ?? "")) {
      setPaymentType("credit");
    } else if (paymentMethod === "간편결제") {
      setPaymentType("kakao_money");
      setError("현재 간편결제는 지원하지 않습니다.");
    }
  }, [paymentMethod]);

  const form = {
    money: String(finalPrice),
    tax: String(Math.floor(finalPrice * 0.1)),
    bongsa: "",
    halbu: String(selectedInstallmentOption),
    catid: "2723444001",
    myunse: "",
    agreenum: "",
    agreedate: "",
    cashno: "",
  };

  const { start } = useRunPaymentFlow({
    form,
    usingCouponCode,
    paymentType,
    setIsModalOpen,
    userId,
    seatNumber,
    seatType,
    passType,
    label,
    ticketId,
    navigate,
    printReceipt,
    printPass: passTicketVisible && printPass,
    setError,
  });

  const handlePayments = () => {
    if (!paymentMethod) {
      setError("결제 수단을 선택해주세요.");
      return;
    }
    if (paymentMethod === "간편결제") {
      return;
    }

    try {
      start();
    } catch (err) {
      console.error("결제 처리 중 오류:", err);
      setError(
        typeof err === "string" ? err : "결제 처리 중 오류가 발생했습니다."
      );
      setIsModalOpen(false);
    }
  };

  return (
    <Container>
      <GoToHomeButton />
      <Header title="결제하기" />

      <Content>
        <PaymentInfo passType={passType} label={labelName} price={finalPrice} />

        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        <PaymentOptionSelector
          installment={installment}
          setInstallment={setInstallment}
          selectedInstallmentOption={selectedInstallmentOption}
          setSelectedInstallmentOption={setSelectedInstallmentOption}
        />

        <PrintSetting
          passTicketVisible={passTicketVisible}
          printReceipt={printReceipt}
          setPrintReceipt={setPrintReceipt}
          printPass={printPass}
          setPrintPass={setPrintPass}
        />
      </Content>

      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="결제하기" submit={handlePayments} />

      <PayAnimationModal
        paymentMethod={paymentMethod}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        price={finalPrice}
      />
    </Container>
  );
};

export default PaymentPage;

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
