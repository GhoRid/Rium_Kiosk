import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import { useEffect, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import OptionCard from "./components/OptionCard";
import BottomButtons from "../../components/BottomButtons";

const PeriodPassPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      // Navigate to the next page with the selected option
      window.location.href = `/payment?option=${selectedOption}`;
    } else {
      setError("이용권을 선택해주세요.");
    }
  };

  useEffect(() => {
    setError(null);
  }, [selectedOption]);

  const SeatList = [
    {
      type: "고정석",
      options: [
        { label: "2주 고정석", price: 150000 },
        { label: "4주 고정석", price: 250000 },
        { label: "8주 고정석", price: 450000 },
      ],
    },
    {
      type: "자유석",
      options: [
        { label: "2주 자유석", price: 100000 },
        { label: "4주 자유석", price: 200000 },
        { label: "8주 자유석", price: 380000 },
      ],
    },
  ];

  return (
    <Container>
      <GoToHomeButton />
      <Header title="기간권" />

      <Content>
        <List>
          {SeatList.map((seat) => (
            <div key={seat.type}>
              <MessageBox>
                <Message>{seat.type}</Message>
              </MessageBox>
              <CardList>
                {seat.options.map((option) => (
                  <OptionCard
                    key={option.label}
                    label={option.label}
                    price={option.price}
                    width={240}
                    height={200}
                    selectedOption={selectedOption}
                    selectOption={setSelectedOption}
                  />
                ))}
              </CardList>
            </div>
          ))}
        </List>
      </Content>
      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="다음" submit={handleNext} />
    </Container>
  );
};

export default PeriodPassPage;

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

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-bottom: 40px;
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
