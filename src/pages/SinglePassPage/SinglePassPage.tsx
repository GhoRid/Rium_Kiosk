import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import OptionCard from "./components/OptionCard";
import { useEffect, useState } from "react";
import BottomButtons from "../../components/BottomButtons";
import ErrorMsg from "../../components/ErrorMsg";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTicketList } from "../../apis/api/pass";

const SinglePassPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["passList", "singlePass"],
    queryFn: () =>
      getTicketList({
        ticketType: 3,
      }),
  });

  const ticketData = data?.data || {};

  // console.log(ticketData);

  const handleNext = () => {
    if (selectedOption) {
      const selectedPass = ticketData.find(
        (ticket: any) => ticket.ticketId === selectedOption
      );

      if (!selectedPass) {
        setError("선택한 이용권 정보를 찾을 수 없습니다.");
        return;
      }

      navigate("/select-seat", {
        state: {
          from: "/selectpass",
          passInformation: {
            passType: "1회 이용권",
            label: `${selectedPass.time}시간`,
            time: selectedPass.time,
            price: selectedPass.price,
            ticketId: selectedPass.ticketId,
          },
        },
      });
    } else {
      setError("이용권을 선택해주세요.");
    }
  };

  useEffect(() => {
    setError(null);
  }, [selectedOption]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <GoToHomeButton />
      <Header title="1회 이용권" />
      <Content>
        <MessageBox>
          <Message>이용 시간을 선택해주세요.</Message>
        </MessageBox>
        {!isLoading && (
          <CardList>
            {ticketData.map((ticket: any, index: any) => (
              <OptionCard
                selectOption={setSelectedOption}
                selectedOption={selectedOption}
                key={index}
                ticketId={ticket.ticketId}
                label={`${ticket.time}시간`}
                price={ticket.price}
                width={175}
                height={175}
              />
            ))}
          </CardList>
        )}
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
