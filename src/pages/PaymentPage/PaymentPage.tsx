import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import PaymentInfo from "./components/PaymentInfo";
import PaymentMethod from "./components/PaymentMethod";
import { useEffect, useRef, useState } from "react";
import PaymentOptionSelector from "./components/PaymentOptionSelector";
import PrintSetting from "./components/PrintSetting";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import { useLocation, useNavigate } from "react-router";
import CardModal from "./components/CardModal";
import { formatDateToYYMMDD } from "../../utils/formatDate";
import { usePayment } from "../../hooks/usePayment";
import { createPaymentBuffer } from "../../utils/paymentUtils/paymentUtils";
import { makeSendData } from "../../utils/paymentUtils/vcatUtils";
import { parseFullResponsePacket } from "../../utils/paymentUtils/formatResponse";
import { handlePaymentSuccess } from "../../utils/handlePaymentSuccess";

type PaymentType = "credit" | "credit_fallback" | "credit_cancel";

const PaymentPage = () => {
  const location = useLocation();
  const {
    passType,
    label,
    price: dd,
    time,
    seatType,
    seatNumber,
  } = location.state || {};
  const price = 10;
  console.log(
    `PaymentPage - passType: ${passType}, label: ${label}, price: ${price}, time: ${time}, seatType: ${seatType}, seatNumber: ${seatNumber}`
  );

  const navigate = useNavigate();
  const didProceedRef = useRef(false);

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [installment, setInstallment] = useState<string>("일시불");
  const [selectedInstallmentOption, setSelectedInstallmentOption] =
    useState<number>(0);

  const [printReceipt, setPrintReceipt] = useState<boolean>(false);
  const [printPass, setPrintPass] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [paymentType, setPaymentType] = useState<PaymentType>("credit");
  const [newdate, setNewdate] = useState(formatDateToYYMMDD(new Date()));

  useEffect(() => {
    if (paymentMethod === "카드") {
      setPaymentType("credit");
    } else if (paymentMethod === "삼성페이") {
      setPaymentType("credit");
    } else if (paymentMethod === "간편결제") {
      // 카카오페이로 변경
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
    agreedate: newdate,
    cashno: "",
  };

  const paymentMutation = usePayment();

  const handleSubmit = () => {
    if (!paymentMethod) {
      setError("결제 수단을 선택해주세요.");
      return;
    } else {
      setIsModalOpen(true);
      setNewdate(formatDateToYYMMDD(new Date()));
      const paymentData = createPaymentBuffer(paymentType, form);
      const vcatPacket = makeSendData(paymentData);
      const sendbuf = encodeURI(vcatPacket);

      paymentMutation.mutate(sendbuf);
    }
  };

  const parsedPacket = paymentMutation.isSuccess
    ? parseFullResponsePacket(paymentMutation.data)
    : null;

  const recvCode = parsedPacket?.recvCode || "";
  const parsedRecvData = parsedPacket?.recvData || null;

  useEffect(() => {
    if (!recvCode || !parsedRecvData) return;
    if (didProceedRef.current) return;

    const respCode = parsedRecvData["응답코드"];

    const run = async () => {
      const processed = await handlePaymentSuccess({
        recvCode,
        respCode,
        passType,
        seatType,
        parsed: parsedRecvData,
      });

      if (processed) {
        didProceedRef.current = true; // 중복 방지
      }
    };

    run();
  }, [recvCode, parsedRecvData, navigate]);

  return (
    <>
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
            printReceipt={printReceipt}
            setPrintReceipt={setPrintReceipt}
            printPass={printPass}
            setPrintPass={setPrintPass}
          />
        </Content>
        {!!error && <ErrorMsg>{error}</ErrorMsg>}

        <BottomButtons submitName="결제하기" submit={handleSubmit} />
      </Container>
      <CardModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        price={price}
      />
    </>
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
