import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import OptionCard from "./components/OptionCard";
import { useEffect, useMemo, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTicketList } from "../../apis/api/pass";

type seatOption = {
  label: string;
  time: number;
  price: number;
};

const TimePassPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const { isExtend } = location.state || {};

  const { data, isLoading } = useQuery({
    queryKey: ["passList", "timePass"],
    queryFn: () =>
      getTicketList({
        ticketType: 1,
      }),
  });

  const toLabel = (name: string) => name.replace(/^시간권\s*/g, "").trim();

  const seatList = useMemo(() => {
    return (
      data?.data.map((ticket: any) => ({
        label: toLabel(ticket.ticketName),
        time: ticket.time,
        price: ticket.price,
        ticketId: ticket.ticketId,
      })) || []
    );
  }, [data]);

  const handleNext = () => {
    if (!selectedOption) {
      setError("이용권을 선택해주세요.");
      return;
    }

    const selectedPass = seatList.find(
      (s: seatOption) => s.label === selectedOption
    );
    if (!selectedPass) {
      setError("선택한 이용권 정보를 찾을 수 없습니다.");
      return;
    }

    if (isExtend) {
      navigate("/payment", {
        state: {
          passType: "시간권",
          label: `${selectedPass.time}시간`,
          price: selectedPass.price,
          time: selectedPass.time,
          ticketId: selectedPass.ticketId,
          isExtend: true,
        },
      });
      return;
    }

    navigate("/payment", {
      state: {
        passType: "시간권",
        label: selectedPass.label,
        price: selectedPass.price,
        time: selectedPass.time,
        ticketId: selectedPass.ticketId,
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
          {seatList.map((seat: seatOption, index: number) => (
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
