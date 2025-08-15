import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { colors } from "../../colors";
import SeatMap from "../../components/seat/SeatMap";
import { useState } from "react";
import BottomButtons from "../../components/BottomButtons";
import ErrorMsg from "../../components/ErrorMsg";
import { useQuery } from "@tanstack/react-query";
import { getInformationSeat } from "../../apis/api/user";

const ChangeSeatPage = () => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const { data: response, error: fetchError } = useQuery({
    queryKey: ["seats"],
    queryFn: () => getInformationSeat(),
  });

  const seatsState = response?.data || [];

  const handleNext = () => {
    if (selectedSeat) {
      // Navigate to the next page with the selected option
      // window.location.href = `/payment?option=${selectedOption}`;
    } else {
      setError("좌석을 선택해주세요.");
    }
  };

  return (
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
