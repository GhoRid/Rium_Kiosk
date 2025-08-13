import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import SeatMap, { Seat } from "./components/SeatMap";
import { useEffect, useState } from "react";
import SeatMapImage from "../../assets/images/seatMapBackground.png"; // 도면 이미지 경로
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import Legend from "./components/Legend";

const seats: Seat[] = [
  { id: 1, label: 1, x: 90, y: 57.8, available: false },
  { id: 2, label: 2, x: 90, y: 48.7, available: true },
  { id: 3, label: 3, x: 90, y: 39.6, available: false },
  { id: 4, label: 4, x: 90, y: 30.45, available: true },
  { id: 5, label: 5, x: 90, y: 21.35, available: false },
  { id: 6, label: 6, x: 90, y: 12.25, available: true },
  { id: 7, label: 7, x: 81.05, y: 2, available: true },
  { id: 8, label: 8, x: 71.15, y: 2, available: true },
  { id: 9, label: 9, x: 61.25, y: 2, available: true },
  { id: 10, label: 10, x: 51.3, y: 2, available: true },
  { id: 11, label: 11, x: 41.35, y: 2, available: true },
  { id: 12, label: 12, x: 22, y: 2, available: true },
  { id: 13, label: 13, x: 12.05, y: 2, available: true },
  { id: 14, label: 14, x: 2.15, y: 2, available: true },

  { id: 15, label: 15, x: 62.15, y: 20.7, available: true },
  { id: 16, label: 16, x: 62.15, y: 29.8, available: true },
  { id: 17, label: 17, x: 62.15, y: 38.85, available: true },
  { id: 18, label: 18, x: 62.15, y: 47.95, available: true },
  { id: 19, label: 19, x: 62.15, y: 57, available: true },

  { id: 20, label: 20, x: 39.5, y: 20.7, available: true },
  { id: 21, label: 21, x: 39.5, y: 29.8, available: true },
  { id: 22, label: 22, x: 39.5, y: 38.85, available: true },
  { id: 23, label: 23, x: 39.5, y: 47.95, available: true },
  { id: 24, label: 24, x: 39.5, y: 57, available: true },

  { id: 25, label: 25, x: 14.7, y: 22.4, available: true },
  { id: 26, label: 26, x: 14.7, y: 31.5, available: true },
  { id: 27, label: 27, x: 14.7, y: 40.4, available: true },
  { id: 28, label: 28, x: 14.7, y: 49.4, available: true },
  { id: 29, label: 29, x: 14.7, y: 58.4, available: true },
  { id: 30, label: 30, x: 14.7, y: 67.4, available: true },

  { id: 31, label: 31, x: 2.1, y: 90.5, available: true },
  { id: 32, label: 32, x: 11.95, y: 90.5, available: true },
  { id: 33, label: 33, x: 21.8, y: 90.5, available: true },
  { id: 34, label: 34, x: 31.6, y: 90.5, available: true },
  { id: 35, label: 35, x: 41.45, y: 90.5, available: true },
  { id: 36, label: 36, x: 51.3, y: 90.5, available: true },
];

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

        <Legend />

        <SeatMap
          selectedSeat={selectedSeat}
          onSelect={setSelectedSeat}
          seats={seats}
          backgroundUrl={SeatMapImage}
        />
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
