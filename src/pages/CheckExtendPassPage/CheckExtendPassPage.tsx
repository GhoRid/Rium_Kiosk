import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import UserInfo from "../../components/Pass/UserInfo";
import PassInfo from "../../components/Pass/PassInfo";
import { getUserId } from "../../utils/tokens";
import { useQuery } from "@tanstack/react-query";
import { getInformationTicket } from "../../apis/api/user";

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

  const {
    name,
    isUsing,
    expirationDate,
    remainTime,
    seatNumber,
    ticketName,
    ticketType,
  } = response?.data || {};

  return (
    <Container>
      <GoToHomeButton />
      <Header title="이용권 확인/연장" />

      <Content>
        <UserInfo name={name} isUsing={isUsing} />

        <PassInfo
          expirationDate={expirationDate}
          remainTime={remainTime}
          seatNumber={seatNumber}
          ticketName={ticketName}
          ticketType={ticketType}
          isUsing={isUsing}
        />
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
