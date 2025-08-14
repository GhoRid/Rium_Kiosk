import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";

const CompletePaymentPage = () => {
  return (
    <Container>
      <GoToHomeButton />
      <Header title="결제완료" />
      <Content></Content>
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
`;
