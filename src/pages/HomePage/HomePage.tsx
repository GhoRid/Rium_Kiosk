import styled from "styled-components";
import HomeMenu from "./components/HomeMenu";
import { colors } from "../../colors";
import SeatInfo from "./components/SeatInfo";
import DateInfo from "./components/DateInfo";
import Header from "./components/Header";
import FooterCarousel from "./components/FooterCarousel";

const HomePage = () => {
  return (
    <>
      <DateInfo />
      <Container>
        {/* 지점명/전화번호/로고 */}
        <Header />

        {/* 좌석 정보 */}
        <SeatInfo />

        {/* 메뉴 버튼 */}
        <HomeMenu />
      </Container>
      {/* 하단 배너 */}
      <FooterCarousel />
    </>
  );
};

export default HomePage;

const Container = styled.div`
  background-color: ${colors.app_background};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  padding: 0 130px;
  margin-top: 200px;
`;
