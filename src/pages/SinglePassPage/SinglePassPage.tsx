import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import OptionCard from "./components/OptionCard";
import { useEffect, useState } from "react";
import BottomButtons from "../../components/BottomButtons";
import ErrorMsg from "../../components/ErrorMsg";
import { useNavigate } from "react-router";

const SinglePassPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedOption) {
      const selectedPass = passList.find(
        (pass) => pass.label === selectedOption
      );

      if (!selectedPass) {
        setError("선택한 이용권 정보를 찾을 수 없습니다.");
        return;
      }

      navigate("/payment", {
        state: {
          passType: "1회 이용권",
          label: selectedPass.label,
          time: selectedPass.time,
          price: selectedPass.price,
        },
      });
    } else {
      setError("이용권을 선택해주세요.");
    }
  };

  useEffect(() => {
    setError(null);
  }, [selectedOption]);

  const passList = [
    {
      label: "2시간",
      time: 2,
      price: 4000,
    },
    {
      label: "3시간",
      time: 3,
      price: 5000,
    },
    {
      label: "4시간",
      time: 4,
      price: 6000,
    },
    {
      label: "5시간",
      time: 5,
      price: 7000,
    },
    {
      label: "6시간",
      time: 6,
      price: 8000,
    },
    {
      label: "8시간",
      time: 8,
      price: 10000,
    },
    {
      label: "10시간",
      time: 10,
      price: 12000,
    },
    {
      label: "12시간",
      time: 12,
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
      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="다음" submit={handleNext} />
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
