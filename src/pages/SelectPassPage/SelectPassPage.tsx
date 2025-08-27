import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import MenuGrid from "./components/MenuGrid";
import { useTicketStore } from "../../stores/useTicketStore";
import { useEffect } from "react";

const SelectPassPage = () => {
  const userHasTicket = useTicketStore((state) => state.hasTicket);

  useEffect(() => {
    if (userHasTicket) {
      window.location.href = "/";
    }
  }, [userHasTicket]);

  return (
    <Container>
      <GoToHomeButton />
      <Header title="이용권 구매" />

      <Content>
        <MessageBox>
          <Message>이용권 종류를 선택해 주세요.</Message>
        </MessageBox>

        <MenuGrid />
      </Content>
    </Container>
  );
};

export default SelectPassPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 480px;
  margin: 0 160px;
  width: calc(100% - 320px);
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 90px;
`;

const Message = styled.span`
  font-size: 50px;
  font-weight: 700;
`;
