import styled from "styled-components";
import { ReactComponent as Logo } from "../../assets/svgs/Logo1.svg";
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

        {/* 하단 공지 */}
      </Container>
      <FooterCarousel />
      {/* <Footer> */}
      {/* <Logo width={40} height={40} fill={colors.app_white} />
        <FooterText>GRAND OPEN!</FooterText> */}
      {/* </Footer> */}
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

const Footer = styled.div`
  margin-top: auto;

  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
  font-size: 18px;
`;
