import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import OptionCard from "./components/OptionCard";
import { useEffect, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import { useNavigate } from "react-router";

const TimePassPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seatList = [
    { label: "10시간", price: 25000 },
    { label: "30시간", price: 50000 },
    { label: "50시간", price: 100000 },
    { label: "100시간", price: 160000 },
    { label: "200시간", price: 280000 },
  ];

  const handleNext = () => {
    if (!selectedOption) {
      setError("이용권을 선택해주세요.");
      return;
    }

    const selected = seatList.find((s) => s.label === selectedOption);
    if (!selected) {
      setError("선택한 이용권 정보를 찾을 수 없습니다.");
      return;
    }

    navigate("/payment", {
      state: {
        passType: "시간권",
        label: selected.label,
        price: selected.price,
      },
    });
  };

  useEffect(() => {
    if (selectedOption) setError(null);
  }, [selectedOption]);

  return (
    <Container>
      <GoToHomeButton />
      <Header title="시간권" />

      <Content>
        <MessageBox>
          <Message>시간권</Message>
        </MessageBox>
        <CardList>
          {seatList.map((seat, index) => (
            <OptionCard
              key={index}
              label={seat.label}
              price={seat.price}
              width={240}
              height={200}
              selectedOption={selectedOption}
              selectOption={setSelectedOption}
            />
          ))}
        </CardList>
      </Content>

      {!!error && <ErrorMsg>{error}</ErrorMsg>}
      <BottomButtons submitName="다음" submit={handleNext} />
    </Container>
  );
};

export default TimePassPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 480px;
  margin: 0 160px;
  width: calc(100% - 320px);
`;

const MessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const Message = styled.span`
  font-size: 50px;
  font-weight: 700;
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
