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

type PaymentType =
  | "credit"
  | "credit_fallback"
  | "credit_cancel"
  | "kakao_money";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location.state);

  const { passType, label, seatType, seatNumber, ticketId } =
    location.state || {};
  const price = 10;

  const passTicketVisible = !!seatNumber;

  const userId = useMemo(() => getUserId(), []);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [installment, setInstallment] = useState<string>("일시불");
  const [selectedInstallmentOption, setSelectedInstallmentOption] =
    useState<number>(0);
  const [printReceipt, setPrintReceipt] = useState<boolean>(true);
  const [printPass, setPrintPass] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("credit");

  useEffect(() => {
    if (["카드", "삼성페이", "간편결제"].includes(paymentMethod ?? "")) {
      setPaymentType("credit");
    }
  }, [paymentMethod]);

  const form = {
    money: String(price),
    tax: "",
    bongsa: "",
    halbu: String(selectedInstallmentOption),
    catid: "2393300001",
    myunse: "",
    agreenum: "",
    agreedate: "",
    cashno: "",
  };

  const { start } = useRunPaymentFlow({
    form,
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
    printPass,
    setPaymentType,
    setError,
  });

  const handlePayments = () => {
    if (!paymentMethod) {
      setError("결제 수단을 선택해주세요.");
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
        <PaymentInfo passType={passType} label={label} price={price} />

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
        price={price}
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
