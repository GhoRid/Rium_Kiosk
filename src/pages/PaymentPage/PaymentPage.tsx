import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import PaymentInfo from "./components/PaymentInfo";
import PaymentMethod from "./components/PaymentMethod";
import { useState } from "react";
import PaymentOptionSelector from "./components/PaymentOptionSelector";
import PrintSetting from "./components/PrintSetting";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import { useLocation } from "react-router";
import CardModal from "./components/CardModal";

const PaymentPage = () => {
  const location = useLocation();
  const { passType, label, price } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [installment, setInstallment] = useState<string>("일시불");
  const [selectedInstallmentOption, setSelectedInstallmentOption] = useState<
    number | null
  >(null);

  const [printReceipt, setPrintReceipt] = useState<boolean>(false);
  const [printPass, setPrintPass] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleNext = () => {
    if (paymentMethod) {
      setIsModalOpen(true);
    } else {
      setError("결재 수단을 선택해주세요.");
    }
  };

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

        <BottomButtons submitName="결제하기" submit={handleNext} />
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
