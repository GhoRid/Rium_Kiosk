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
import { formatDateToYYMMDD } from "../../utils/formatDate";
import { useNVCatPayment, usePaymentMutations } from "../../hooks/usePayment";
import { createPaymentBuffer } from "../../utils/paymentUtils/paymentUtils";
import { makeSendData } from "../../utils/paymentUtils/vcatUtils";
import { parseFullResponsePacket } from "../../utils/paymentUtils/formatResponse";
import { handlePaymentCode } from "../../utils/paymentUtils/handlePaymentCode";
import PayAnimationModal from "./components/PayAnimationModal";
import { useMutation } from "@tanstack/react-query";
import { postQR, postreceipt } from "../../apis/api/receipt";
import { PurchaseTicketData, QRData, ReceiptData } from "../../types/payment";
import { purchaseTicket } from "../../apis/api/pass";

type PaymentType = "credit" | "credit_fallback" | "credit_cancel";

const PaymentPage = () => {
  const location = useLocation();
  const { passType, label, time, seatType, seatNumber } = location.state || {};
  const price = 10;

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
    agreedate: newdate,
    cashno: "",
  };

  const paymentMutation = useNVCatPayment();

  const { receiptMutation, qrMutation, purchaseTicketMutation } =
    usePaymentMutations();

  const handleSubmit = () => {
    if (!paymentMethod) {
      setError("결제 수단을 선택해주세요.");
      return;
    }
    setIsModalOpen(true);
    setNewdate(formatDateToYYMMDD(new Date()));
    const paymentData = createPaymentBuffer(paymentType, form);
    const vcatPacket = makeSendData(paymentData);
    const sendbuf = encodeURI(vcatPacket);
    paymentMutation.mutate(sendbuf);
  };

  const parsedPacket = paymentMutation.isSuccess
    ? parseFullResponsePacket(paymentMutation.data)
    : null;

  const recvCode = parsedPacket?.recvCode || "";
  const parsedRecvData = parsedPacket?.recvData || null;

  useEffect(() => {
    if (!recvCode || !parsedRecvData) return;
    if (didProceedRef.current) return;

    const respCode = parsedRecvData["응답코드"] ?? "";

    (async () => {
      const processed = await handlePaymentCode({
        navigate,
        recvCode,
        respCode,
        parsed: parsedRecvData,
        label,
        passType,
        seatType,
        seatNumber,
        printReceipt,
        printPass,
        receiptMutation,
        qrMutation,
        purchaseTicketMutation,
      });

      if (processed) {
        didProceedRef.current = true;
        setIsModalOpen(false);
      }
    })();
  }, [
    recvCode,
    parsedRecvData,
    navigate,
    passType,
    seatType,
    seatNumber,
    label,
    printReceipt,
    printPass,
    purchaseTicketMutation.mutate,
    receiptMutation.mutate,
    qrMutation.mutate,
  ]);

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

      <PayAnimationModal
        paymentMethod={paymentMethod}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        price={price}
      />
    </>
  );
};

export default PaymentPage;

// --- styles ---
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
