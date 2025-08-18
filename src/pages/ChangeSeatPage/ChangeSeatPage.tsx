import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { colors } from "../../colors";
import SeatMap from "../../components/seat/SeatMap";
import { useState } from "react";
import BottomButtons from "../../components/BottomButtons";
import ErrorMsg from "../../components/ErrorMsg";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInformationMyseat,
  getInformationSeat,
  getInformationTicket,
} from "../../apis/api/user";
import CustomModal from "../../components/CustomModal";
import { useNavigate } from "react-router";
import { changeSeat } from "../../apis/api/pass";
import { useUserId } from "../../hooks/useUserId";

const ChangeSeatPage = () => {
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const userId = useUserId();

  const { data: myTicketResponse } = useQuery({
    queryKey: ["myTicket"],
    queryFn: () => getInformationTicket({ mobileNumber: userId! }),
  });

  const { isReservedTicket, seatNumber } = myTicketResponse?.data || {};

  const { data: response, error: fetchError } = useQuery({
    queryKey: ["infoSeats"],
    queryFn: () => getInformationSeat(),
  });

  const seatsState = response?.data || [];

  const handleNext = () => {
    if (selectedSeat) {
      changeSeatMutation.mutate();
    } else {
      setError("좌석을 선택해주세요.");
    }
  };

  const changeSeatMutation = useMutation({
    mutationKey: ["changeSeat"],
    mutationFn: () =>
      changeSeat({
        mobileNumber: userId!,
        seatId: selectedSeat!,
      }),
    onSuccess: () => {
      setIsModalOpen(true);
    },
    onError: (error) => {
      setError("자리 이동에 실패했습니다.");
    },
  });

  return (
    <>
      <Container>
        <GoToHomeButton />
        <Header title="자리 이동" />

        <Content>
          <MessageBox>
            <Message>좌석을 선택해주세요.</Message>
          </MessageBox>

          <SeatMap
            selectedSeat={selectedSeat}
            onSelect={setSelectedSeat}
            seatsState={seatsState}
            usingSeatNumber={seatNumber}
            isReservedTicket={isReservedTicket}
          />
        </Content>

        {!!error && <ErrorMsg>{error}</ErrorMsg>}

        <BottomButtons
          submit={() => {
            handleNext();
          }}
          submitName="자리 이동"
        />
      </Container>
      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalContent={"12번 좌석으로\n자리 이동이 완료되었습니다."}
        submitText="홈으로"
        submitAction={() => navigate("/home")}
      />
    </>
  );
};

export default ChangeSeatPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 250px;
  margin: 0 100px;
  width: calc(100% - 200px);
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 65px;
`;

const Message = styled.span`
  font-size: 50px;
  font-weight: 700;
`;
