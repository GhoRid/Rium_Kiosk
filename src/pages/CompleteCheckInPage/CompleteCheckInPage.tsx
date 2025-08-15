import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router";
import FreeSeatForm from "../../components/completeForm/FreeSeatForm";
import BottomButton from "../CompletePaymentPage/components/BottomButton";
import CompleteCheckInForm from "./components/CompleteCheckInForm";
import { clearUserId } from "../../utils/tokens";

const CompleteCheckInPage = () => {
  const date = new Date();
  const navigate = useNavigate();

  const pad = (n: number) => String(n).padStart(2, "0");
  const formattedDate = `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

  const location = useLocation();
  const { selectedSeat } = location.state || {};

  const handleOkay = () => {
    navigate("/home");
    clearUserId();
  };

  return (
    <Container>
      <Header title="결제완료" />
      <Content>
        <MessageBox>
          <Message>입실 처리가 완료되었습니다.</Message>
        </MessageBox>

        <CompleteCheckInForm date={formattedDate} selectedSeat={selectedSeat} />
      </Content>
      <BottomButton submitName="확인" submit={() => handleOkay()} />
    </Container>
  );
};

export default CompleteCheckInPage;

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
