// src/pages/HomePage.tsx
import styled from "styled-components";
import { ReactComponent as Logo } from "../../assets/svgs/Logo1.svg";
import HeaderDate from "./components/HeaderDate";
import HomeMenu from "./components/HomeMenu";
import { colors } from "../../colors";
import SeatInfo from "./components/SeatInfo";

const HomePage = () => {
  return (
    <>
      <Container>
        {/* 상단 날짜/시간 */}
        <HeaderDate />

        {/* 지점명/전화번호 */}
        <BranchInfo>
          <BranchName>문흥점</BranchName>
          <BranchPhone>010-5391-2895</BranchPhone>
        </BranchInfo>

        {/* 로고 + 지점명 */}
        <LogoWrapper>
          <Logo width={80} height={80} fill="#fff" />
          <BrandName>리움</BrandName>
        </LogoWrapper>

        {/* 좌석 정보 */}
        <SeatInfo />

        {/* 메뉴 버튼 */}
        <HomeMenu />

        {/* 하단 공지 */}
      </Container>
      <Footer>
        <Logo width={40} height={40} fill="#fff" />
        <FooterText>GRAND OPEN!</FooterText>
      </Footer>
    </>
  );
};

export default HomePage;

const Container = styled.div`
  background-color: ${colors.app_background};
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0 130px;
`;

const BranchInfo = styled.div`
  margin-top: 20px;
  font-size: 14px;
  display: flex;
  gap: 8px;
`;

const BranchName = styled.span``;
const BranchPhone = styled.span``;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const BrandName = styled.span`
  font-size: 28px;
  font-weight: bold;
`;

const Footer = styled.div`
  margin-top: auto;
  background-color: #0f2240;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
  font-size: 18px;
`;

const FooterText = styled.span``;
