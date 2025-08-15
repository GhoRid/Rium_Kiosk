import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import BottomButton from "./components/BottomButton";
import { useLocation } from "react-router";
import SinglePassForm from "./components/SinglePassForm";
import FixedSeatForm from "./components/FixedSeatForm";
import FreeSeatForm from "./components/FreeSeatForm";

const CompletePaymentPage = () => {
  const location = useLocation();
  console.log("CompletePaymentPage location state:", location.state);
  // const { passType, label, price } = location.state || {};

  // 1회 이용권, 자유석, 고정석
  const passtype = "고정석";

  return (
    <Container>
      <GoToHomeButton />
      <Header title="결제완료" />
      <Content>
        <MessageBox>
          <Message>결제가 완료되었습니다.</Message>
        </MessageBox>

        {/* <SinglePassForm /> */}
        {/* <FixedSeatForm /> */}
        <FreeSeatForm />
      </Content>
      <BottomButton submitName="확인" submit={() => {}} />
    </Container>
  );
};

export default CompletePaymentPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 400px;
  margin: 0 160px;
  width: calc(100% - 320px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.span`
  font-size: 50px;
  font-weight: 700;
`;
