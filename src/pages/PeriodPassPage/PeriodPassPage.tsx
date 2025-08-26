import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";
import GoToHomeButton from "../../components/GoToHomeButton";
import { useEffect, useMemo, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import OptionCard from "./components/OptionCard";
import BottomButtons from "../../components/BottomButtons";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTicketList } from "../../apis/api/pass";

type SeatOption = {
  label: string;
  time: number;
  seatType: "고정석" | "자유석";
  price: number;
  ticketId: number;
};

type SeatGroup = {
  type: "고정석" | "자유석";
  options: SeatOption[];
};

type TicketRow = {
  ticketId: number;
  ticketName: string;
  ticketType: number;
  time: number;
  price: number;
  period: number | null;
};

const PeriodPassPage = () => {
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: fixedSeatData, isLoading: fixedSeatIsLodaing } = useQuery({
    queryKey: ["passList", "고정석"],
    queryFn: () =>
      getTicketList({
        ticketType: 2,
      }),
  });

  const { data: freeSeatData, isLoading: freeSeatIsLodaing } = useQuery({
    queryKey: ["passList", "자유석"],
    queryFn: () =>
      getTicketList({
        ticketType: 4,
      }),
  });

  const toLabel = (name: string) => name.replace(/^기간권\s*/g, "").trim();

  const mapToOptions = (
    rows: TicketRow[] | undefined,
    seatType: "고정석" | "자유석"
  ): SeatOption[] => {
    if (!rows || !Array.isArray(rows)) return [];
    return rows.map((r) => ({
      label: toLabel(r.ticketName),
      time: r.time,
      seatType,
      price: r.price,
      ticketId: r.ticketId,
    }));
  };

  const SeatList: SeatGroup[] = useMemo(() => {
    const fixedRows = (fixedSeatData?.data ?? []) as TicketRow[];
    const freeRows = (freeSeatData?.data ?? []) as TicketRow[];

    const fixedOptions = mapToOptions(fixedRows, "고정석");
    const freeOptions = mapToOptions(freeRows, "자유석");

    const groups: SeatGroup[] = [];
    if (fixedOptions.length)
      groups.push({ type: "고정석", options: fixedOptions });
    if (freeOptions.length)
      groups.push({ type: "자유석", options: freeOptions });
    return groups;
  }, [fixedSeatData, freeSeatData]);

  const isLoading = fixedSeatIsLodaing || freeSeatIsLodaing;

  const handleNext = () => {
    if (!selectedOption) {
      setError("이용권을 선택해주세요.");
      return;
    }

    let seatType: "고정석" | "자유석" | null = null;
    let label: string | null = null;
    let time: number | null = null;
    let price: number | null = null;
    let ticketId: number | null = null;

    for (const seat of SeatList) {
      const selectedPass = seat.options.find(
        (o) => o.ticketId === selectedOption
      );
      if (selectedPass) {
        seatType = seat.type;
        label = selectedPass.label;
        time = selectedPass.time;
        price = selectedPass.price;
        ticketId = selectedPass.ticketId;
      }
    }

    if (!seatType || !label || time == null || price == null) {
      setError("선택한 이용권 정보를 찾을 수 없습니다.");
      return;
    }

    if (seatType === "고정석") {
      navigate("/select-seat", {
        state: {
          toPurchase: true,
          passInformation: {
            passType: "기간권",
            label,
            time,
            price,
            seatType,
            ticketId,
          },
        },
      });
    } else {
      navigate("/payment", {
        state: {
          passType: "기간권",
          seatType,
          label,
          time,
          price,
          ticketId,
        },
      });
    }
  };

  useEffect(() => {
    if (selectedOption) setError(null);
  }, [selectedOption]);

  return (
    <Container>
      <GoToHomeButton />
      <Header title="기간권" />

      <Content>
        {isLoading ? (
          <MessageBox>
            <Message>불러오는 중…</Message>
          </MessageBox>
        ) : SeatList.length === 0 ? (
          <MessageBox>
            <Message>표시할 이용권이 없습니다.</Message>
          </MessageBox>
        ) : (
          <List>
            {SeatList.map((seat) => (
              <div key={seat.type}>
                <MessageBox>
                  <Message>{seat.type}</Message>
                </MessageBox>

                <CardList>
                  {seat.options.map((option) => (
                    <OptionCard
                      key={option.ticketId}
                      label={option.label}
                      ticketId={option.ticketId}
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
        )}
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
  padding-top: 350px;
  margin: 0 160px;
  width: calc(100% - 320px);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
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
