import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";

const CheckExtendPassPage = () => {
  return (
    <Container>
      <GoToHomeButton />
      <Header title="이용권 확인/연장" />
      <Content>
        {/* 여기에 이용권 확인/연장 관련 컴포넌트들을 추가하세요 */}
        {/* 예: 이용권 리스트, 연장 버튼 등 */}
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
