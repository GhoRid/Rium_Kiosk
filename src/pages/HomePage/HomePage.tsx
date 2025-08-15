import styled from "styled-components";
import HomeMenu from "./components/HomeMenu";
import { colors } from "../../colors";
import SeatInfo from "./components/SeatInfo";
import DateInfo from "./components/DateInfo";
import HomeHeader from "./components/HomeHeader";
import FooterCarousel from "./components/FooterCarousel";
import CustomModal from "../../components/CustomModal";
import { useState } from "react";
import LogoutButton from "./components/LogoutButton";
import { useUserId } from "../../hooks/useUserId";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const userId = useUserId();
  return (
    <>
      <Container>
        <DateInfo />
        {userId && <LogoutButton />}
        <ContentContainer>
          {/* 지점명/전화번호/로고 */}
          <HomeHeader />

          {/* 좌석 정보 */}
          <SeatInfo />

          {/* 메뉴 버튼 */}
          <HomeMenu setIsModalOpen={setIsModalOpen} />
        </ContentContainer>
        {/* 하단 배너 */}
        <FooterCarousel />
      </Container>

      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalContent={"12번 좌석\n퇴실하시겠습니까?"}
        submitText={"퇴실하기"}
        submitAction={() => {
          console.log("퇴실하기");
          // setIsModalOpen(false);
        }}
      />
    </>
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
  margin-top: 120px;
`;
