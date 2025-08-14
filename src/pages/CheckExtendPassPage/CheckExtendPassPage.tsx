import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import UserInfo from "./components/UserInfo";
import PassInfo from "./components/PassInfo";

const CheckExtendPassPage = () => {
  return (
    <Container>
      <GoToHomeButton />
      <Header title="이용권 확인/연장" />

      <Content>
        <UserInfo />

        <PassInfo />
      </Content>
    </Container>
  );
};

export default CheckExtendPassPage;

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
