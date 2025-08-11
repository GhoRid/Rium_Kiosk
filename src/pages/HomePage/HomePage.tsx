import styled from "styled-components";
import HomeMenu from "./components/HomeMenu";
import { colors } from "../../colors";
import SeatInfo from "./components/SeatInfo";
import DateInfo from "./components/DateInfo";
import Header from "./components/Header";
import FooterCarousel from "./components/FooterCarousel";

const HomePage = () => {
  return (
    <Container>
      <DateInfo />
      <ContentContainer>
        {/* 지점명/전화번호/로고 */}
        <Header />

        {/* 좌석 정보 */}
        <SeatInfo />

        {/* 메뉴 버튼 */}
        <HomeMenu />
      </ContentContainer>
      {/* 하단 배너 */}
      <FooterCarousel />
    </Container>
  );
};

export default HomePage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
`;

const ContentContainer = styled.div`
  padding: 0 130px;
  margin-top: 200px;
`;
