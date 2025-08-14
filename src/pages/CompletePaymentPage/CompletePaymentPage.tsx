import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import DemoQr from "./components/DemoQR";

const CompletePaymentPage = () => {
  return (
    <Container>
      <GoToHomeButton />
      <Header title="결제완료" />
      <Content>
        <MessageBox>
          <Message>결제가 완료되었습니다.</Message>
        </MessageBox>

        <DemoQr />
      </Content>
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
  padding-top: 280px;
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
  margin-bottom: 65px;
`;

const Message = styled.span`
  font-size: 50px;
  font-weight: 700;
`;
