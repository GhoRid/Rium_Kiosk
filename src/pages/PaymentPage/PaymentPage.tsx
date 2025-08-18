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

import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import { formatDateToYYMMDD } from "../../utils/formatDate";
import { createPaymentBuffer } from "../../utils/paymentUtils/paymentUtils";
import { makeSendData } from "../../utils/paymentUtils/vcatUtils";
import { parseFullResponsePacket } from "../../utils/paymentUtils/formatResponse";
import { getUserId } from "../../utils/tokens";

import { useNVCatPayment, usePaymentMutations } from "../../hooks/usePayment";

type PaymentType = "credit" | "credit_fallback" | "credit_cancel";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { passType, label, time, seatType, seatNumber } = location.state || {};
  const price = 10;
  const userId = getUserId();
  const approvedAt = new Date().toISOString();

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [installment, setInstallment] = useState<string>("일시불");
  const [selectedInstallmentOption, setSelectedInstallmentOption] =
    useState<number>(0);
  const [printReceipt, setPrintReceipt] = useState<boolean>(true);
  const [printPass, setPrintPass] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<PaymentType>("credit");
  const [newdate, setNewdate] = useState(formatDateToYYMMDD(new Date()));

  const paymentMutation = useNVCatPayment();
  const { receiptMutation, qrMutation, purchaseTicketMutation } =
    usePaymentMutations();

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

  const handleSubmit = () => {
    if (!paymentMethod) {
      setError("결제 수단을 선택해주세요.");
      return;
    }

    setIsModalOpen(true);
    setNewdate(formatDateToYYMMDD(new Date()));

    const paymentData = createPaymentBuffer(paymentType, form);
    const vcatPacket = makeSendData(paymentData);
    paymentMutation.mutate(encodeURI(vcatPacket));
  };

  useEffect(() => {
    if (!paymentMutation.isSuccess) return;

    const parsedPacket = parseFullResponsePacket(paymentMutation.data);
    if (!parsedPacket) return;

    const { recvCode, recvData } = parsedPacket;
    const respCode = recvData?.["응답코드"] ?? "";

    if (recvCode !== "0000" || respCode !== "0000") {
      setError("결제가 실패했습니다.");
      setIsModalOpen(false);
      return;
    }

    const toNum = (v?: string) => (v && v.trim() !== "" ? Number(v) : 0);

    const payment = {
      company: "투리버스",
      ceo: "이헌재",
      company_num: "123-45-67890",
      tel: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      cardCompany: recvData?.["매입사명"] ?? "",
      catId: recvData?.["CATID"] ?? recvData?.["승인CATID"] ?? "",
      cardNum: recvData?.["카드BIN"] ?? "",
      date: recvData?.["승인일시"] ?? "",
      transactionAmount: toNum(
        recvData?.["승인금액"] ?? recvData?.["거래금액"]
      ),
      vat: toNum(recvData?.["부가세"]),
      total: toNum(recvData?.["실승인금액"]),
      approvalNumber: recvData?.["승인번호"] ?? "",
      merchantNumber: recvData?.["가맹점번호"] ?? "",
      acquier: recvData?.["발급사명"] ?? "",
      installment: (recvData?.["할부개월"] ?? "00") !== "00",
    };

    const requestBody = {
      mobileNumber: userId!,
      remainTime: time!,
      ...(typeof seatNumber === "number" && seatNumber > 0
        ? { seatId: seatNumber }
        : {}),
      ...(seatType === "고정석" ? { periodTicketType: 1 } : {}),
      ...(seatType === "자유석" ? { periodTicketType: 2 } : {}),
      payment,
    };

    (async () => {
      try {
        const purchaseRes = await purchaseTicketMutation.mutateAsync({
          passtype: passType,
          requestBody,
        });

        if (printReceipt) {
          await receiptMutation.mutateAsync(payment);
        }

        if (printPass) {
          await qrMutation.mutateAsync({
            token: purchaseRes?.data,
            size: 10,
          });
        }

        let statusForm: Record<string, unknown> = {};
        if (passType === "1회 이용권") {
          statusForm = { resultType: passType, seatNumber, approvedAt };
        } else if (passType === "기간권" && seatType === "고정석") {
          statusForm = { resultType: "고정석", seatNumber, passType, label };
        } else if (passType === "시간권") {
          statusForm = { resultType: "자유석", passType, label };
        }

        navigate("/completepayment", { replace: true, state: statusForm });
      } catch (err) {
        setError("티켓 발급에 실패했습니다.");
        setIsModalOpen(false);
      }
    })();
  }, [paymentMutation.isSuccess]);

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
          printReceipt={printReceipt}
          setPrintReceipt={setPrintReceipt}
          printPass={printPass}
          setPrintPass={setPrintPass}
        />
      </Content>

      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="결제하기" submit={handleSubmit} />

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
