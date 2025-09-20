import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import UserInfo from "../../components/Pass/UserInfo";
import PassInfoCard from "./components/PassInfoCard";
import { getUserId } from "../../utils/tokens";
import { useQuery } from "@tanstack/react-query";
import {
  getInformationTicket,
  getInformationTicketType,
} from "../../apis/api/user";
import { useState } from "react";
import CustomModal from "../../components/CustomModal";
import { useNavigate } from "react-router";

const CheckExtendPassPage = () => {
  const navitate = useNavigate();
  const userId = getUserId();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPassInfo", userId],
    queryFn: () => getInformationTicket({ mobileNumber: userId! }),
    enabled: !!userId,
  });

  const {
    data: getInformationTicketTypeData,
    isLoading: getInformationTicketTypeLoading,
    error: getInformationTicketTypeError,
  } = useQuery({
    queryKey: ["userPasgetInformationTicketTypesInfo", userId],
    queryFn: () => getInformationTicketType({ mobileNumber: userId! }),
    enabled: !!userId,
  });

  const ticketType = getInformationTicketTypeData?.data;

  const onExtendClick = () => {
    switch (ticketType) {
      case 1:
        navitate("/timepass");
        break;
      case 2:
        navitate("/periodpass", { state: { extendingTicketType: 2 } });
        break;
      case 3:
        navitate("/singlepass");
        break;
      case 4:
      default:
        setIsModalOpen(true);
        break;
    }
  };

  const { name, isUsing, expirationDate, remainTime, seatNumber, ticketName } =
    response?.data || {};

  console.log(getInformationTicketTypeData?.data);

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
          isUsing={isUsing}
          onExtendClick={() => setIsModalOpen(true) /*onExtendClick()*/}
        />
      </Content>
      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        submitText="확인"
        submitAction={() => setIsModalOpen(false)}
        isCloseIconVisible={false}
        modalContent="현재 이용권을 연장할 수 없습니다."
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
