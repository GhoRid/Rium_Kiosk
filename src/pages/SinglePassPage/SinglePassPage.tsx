import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import OptionCard from "./components/OptionCard";
import { useState } from "react";
import BottomButtons from "../../components/BottomButtons";

const SinglePassPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const passList = [
    {
      label: "2시간",
      price: 4000,
    },
    {
      label: "3시간",
      price: 5000,
    },
    {
      label: "4시간",
      price: 6000,
    },
    {
      label: "5시간",
      price: 7000,
    },
    {
      label: "6시간",
      price: 8000,
    },
    {
      label: "8시간",
      price: 10000,
    },
    {
      label: "10시간",
      price: 12000,
    },
    {
      label: "12시간",
      price: 14000,
    },
  ];

  return (
    <Container>
      <GoToHomeButton />
      <Header title="1회 이용권" />
      <Content>
        <MessageBox>
          <Message>이용 시간을 선택해주세요.</Message>
        </MessageBox>
        <CardList>
          {passList.map((pass, index) => (
            <OptionCard
              selectOption={setSelectedOption}
              selectedOption={selectedOption}
              key={index}
              label={pass.label}
              price={pass.price}
              width={175}
              height={175}
            />
          ))}
        </CardList>
      </Content>
      <BottomButtons submitName="다음" />
    </Container>
  );
};

export default SinglePassPage;

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
  margin-bottom: 90px;
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
