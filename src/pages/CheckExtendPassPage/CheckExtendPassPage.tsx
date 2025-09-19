import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import UserInfo from "../../components/Pass/UserInfo";
import PassInfoCard from "./components/PassInfoCard";
import { getUserId } from "../../utils/tokens";
import { useQuery } from "@tanstack/react-query";
import { getInformationTicket } from "../../apis/api/user";
import { useState } from "react";
import CustomModal from "../../components/CustomModal";

const CheckExtendPassPage = () => {
  const userId = getUserId();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPassInfo", userId],
    queryFn: () => getInformationTicket({ mobileNumber: userId! }),
    enabled: !!userId,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    name,
    isUsing,
    expirationDate,
    remainTime,
    seatNumber,
    ticketName,
    ticketType,
  } = response?.data || {};

  console.log(response?.data);

  return (
    <Container>
      <GoToHomeButton />
      <Header title="이용권 확인/연장" />

      <Content>
        <UserInfo name={name} isUsing={isUsing} />

        <PassInfoCard
          expirationDate={expirationDate}
          remainTime={remainTime}
          seatNumber={seatNumber}
          ticketName={ticketName}
          ticketType={ticketType}
          isUsing={isUsing}
          setIsModalOpen={setIsModalOpen}
        />
      </Content>
      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        submitText="확인"
        submitAction={() => setIsModalOpen(false)}
        isCloseIconVisible={false}
        modalContent="현재 지원하지 않는 기능입니다."
      />
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
