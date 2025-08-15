import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import SeatMap from "../../components/seat/SeatMap";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  disableTicket,
  enableTicket,
  getInformationMyseat,
  getInformationSeat,
} from "../../apis/api/user";
import { useUserId } from "../../hooks/useUserId";

const SelectSeatPage = () => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = useUserId();

  const { data: response, error: fetchError } = useQuery({
    queryKey: ["seats"],
    queryFn: () => getInformationSeat(),
  });

  const disableTicketMutation = useMutation({
    mutationFn: () =>
      disableTicket({
        mobileNumber: userId!,
        seatNumber: null,
      }),
    onError: (error) => {
      setError("좌석 선택을 취소하는 데 실패했습니다. 다시 시도해주세요.");
    },
  });

  const seatsState = response?.data || [];

  const selectSeatMutatuion = useMutation({
    mutationFn: () =>
      enableTicket({
        mobileNumber: userId!,
        seatNumber: selectedSeat!,
      }),
    onError: (error) => {
      setError("좌석 선택에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleNext = () => {
    if (selectedSeat) {
      selectSeatMutatuion.mutate();
    } else {
      setError("좌석을 선택해주세요.");
    }
  };

  useEffect(() => {
    if (selectedSeat) {
      setError(null);
    }
  }, [selectedSeat]);

  return (
    <Container>
      <GoToHomeButton />
      <Header title="좌석 선택" />

      <Content>
        <MessageBox>
          <Message>좌석을 선택해주세요</Message>
        </MessageBox>

        <SeatMap
          selectedSeat={selectedSeat}
          onSelect={setSelectedSeat}
          seatsState={seatsState}
        />
      </Content>

      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="입실하기" submit={handleNext} />
    </Container>
  );
};

export default SelectSeatPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 280px;
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
