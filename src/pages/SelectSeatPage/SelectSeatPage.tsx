import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import ErrorMsg from "../../components/ErrorMsg";
import BottomButtons from "../../components/BottomButtons";
import SeatMap from "../../components/seat/SeatMap";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enableTicket, getInformationSeat } from "../../apis/api/user";
import { useUserId } from "../../hooks/useUserId";
import { useLocation, useNavigate } from "react-router";
import { sendUseTicketCoupon } from "../../apis/api/pass";
import { useAppPaymentMutations } from "../../hooks/usePayment";

const SelectSeatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { passInformation, couponData, from } = location.state || {};

  const [selectedSeatId, setselectedSeatId] = useState<number | null>(null);
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const userId = useUserId();

  // qr 출력 함수
  const { qrMutation } = useAppPaymentMutations();

  // 실시간 좌석 정보 가져오기
  const {
    data: response,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["seats", passInformation],
    queryFn: () => getInformationSeat(),
  });

  // 이용권 쿠폰 사용시 처리 함수
  const sendUseTicketCouponMutatuion = useMutation({
    mutationFn: () =>
      sendUseTicketCoupon({
        mobileNumber: userId!,
        seatId: selectedSeatId!,
        token: couponData!,
      }),
    onError: (error) => {
      setError("다시 시도해주세요.");
    },
  });

  const {
    isSuccess: sendUseTicketCouponIsSuccess,
    data: sendUseTicketCouponData,
  } = sendUseTicketCouponMutatuion;

  useEffect(() => {
    if (sendUseTicketCouponIsSuccess) {
      const qrCode = sendUseTicketCouponData.data;
      qrMutation.mutate({
        token: qrCode,
        size: 10,
      });
      navigate("/completecheckin", {
        state: {
          selectedSeatNumber: selectedSeatNumber,
        },
      });
    }
  }, [sendUseTicketCouponIsSuccess]);

  const seatsState = response?.data || [];

  // 자리 선택 후 활성화 ( 입실 )
  const selectSeatMutatuion = useMutation({
    mutationFn: () =>
      enableTicket({
        mobileNumber: userId!,
        seatId: selectedSeatId!,
      }),
    onError: (error) => {
      setError("좌석 선택에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const { isSuccess: selectSeatIsSuccess, data: selectSeatData } =
    selectSeatMutatuion;

  useEffect(() => {
    if (selectSeatIsSuccess) {
      const qrCode = selectSeatData.data;
      qrMutation.reset();
      qrMutation.mutate({
        token: qrCode,
        size: 10,
      });
      navigate("/completecheckin", {
        state: {
          selectedSeatNumber: selectedSeatNumber,
        },
      });
    }
  }, [selectSeatIsSuccess]);

  const handleNext = () => {
    if (selectedSeatId) {
      if (from === "/selectpass") {
        navigate("/payment", {
          state: {
            passType: passInformation.passType,
            label: passInformation.label,
            time: passInformation.time,
            price: passInformation.price,
            seatNumber: selectedSeatId,
            seatType: passInformation.seatType,
            ticketId: passInformation.ticketId,
          },
        });
      } else if (from === "/usecoupon") {
        sendUseTicketCouponMutatuion.mutate();
      } else {
        selectSeatMutatuion.mutate();
      }
    } else {
      setError("좌석을 선택해주세요.");
    }
  };

  useEffect(() => {
    if (selectedSeatId) {
      setError(null);
    }
  }, [selectedSeatId]);

  const onSelect = ({
    seatId,
    seatNumber,
  }: {
    seatId: number;
    seatNumber: number;
  }) => {
    setselectedSeatId(selectedSeatId === seatId ? null : seatId);
    setSelectedSeatNumber(
      selectedSeatNumber === seatNumber ? null : seatNumber
    );
  };

  return (
    <Container>
      <GoToHomeButton />
      <Header title="좌석 선택" />

      <Content>
        <MessageBox>
          <Message>좌석을 선택해주세요</Message>
        </MessageBox>

        {!isLoading && !fetchError && (
          <SeatMap
            selectedSeatNumber={selectedSeatNumber}
            selectedSeatId={selectedSeatId}
            onSelect={onSelect}
            seatsState={seatsState}
          />
        )}
      </Content>

      {!!error && <ErrorMsg>{error}</ErrorMsg>}

      <BottomButtons submitName="입실하기" submit={handleNext} />
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
