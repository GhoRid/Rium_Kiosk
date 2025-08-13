import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import PaymentInfo from "./components/PaymentInfo";
import PaymentMethod from "./components/PaymentMethod";
import { useState } from "react";
import PaymentOptionSelector from "./components/PaymentOptionSelector";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  return (
    <Container>
      <GoToHomeButton />
      <Header title="결제하기" />
      <Content>
        <PaymentInfo />

        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        <PaymentOptionSelector />
      </Content>
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
