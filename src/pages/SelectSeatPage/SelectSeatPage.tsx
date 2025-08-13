import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import SeatMap from "../../components/seat/SeatMap";

const SelectSeatPage = () => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSeat) {
      // Navigate to the next page with the selected option
      //   window.location.href = `/payment?option=${selectedSeat}`;
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

        <SeatMap selectedSeat={selectedSeat} onSelect={setSelectedSeat} />
      </Content>

      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="다음" submit={handleNext} />
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
