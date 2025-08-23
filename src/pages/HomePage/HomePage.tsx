import styled from "styled-components";
import HomeMenu from "./components/HomeMenu";
import { colors } from "../../colors";
import SeatInfo from "./components/SeatInfo";
import DateInfo from "./components/DateInfo";
import HomeHeader from "./components/HomeHeader";
import FooterCarousel from "./components/FooterCarousel";
import CustomModal from "../../components/CustomModal";
import { useState } from "react";
import LogoutButton from "./components/LogoutButton";
import { useUserId } from "../../hooks/useUserId";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlaceInformation } from "../../apis/api/kioskAuth";
import {
  checkPresentTicket,
  checkUsing,
  disableTicket,
} from "../../apis/api/user";
import { clearUserId } from "../../utils/tokens";
import { useNavigate } from "react-router";
import { reissueTicket } from "../../apis/api/pass";
import { postQR } from "../../apis/api/receipt";

const HomePage = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{
    content: string;
    submitText: string;
    submitAction: () => void;
    isCloseIconVisible: boolean;
  }>({
    content: "",
    submitText: "",
    submitAction: () => {},
    isCloseIconVisible: true,
  });

  const userId = useUserId();

  const { data: placeInfoData } = useQuery({
    queryKey: ["placeInformation"],
    queryFn: () => getPlaceInformation(),
  });

  const { data: checkUsingData } = useQuery({
    queryKey: ["checkUsing", userId],
    queryFn: () => checkUsing({ mobileNumber: userId }),
    enabled: !!userId,
  });

  const reissueTicketMutation = useMutation({
    mutationKey: ["reissueTicket", userId],
    mutationFn: () => reissueTicket({ mobileNumber: userId }),
  });

  const { data: checkPresentTicketData } = useQuery({
    queryKey: ["checkPresentTicket", userId],
    queryFn: () => checkPresentTicket({ mobileNumber: userId }),
    enabled: !!userId,
  });

  const { isUsing, seatNumber } = checkUsingData?.data || {};
  const isPresent = checkPresentTicketData?.data || {};

  const ticketToken = reissueTicketMutation?.data?.data || "";

  const qrMutation = useMutation({
    mutationKey: ["qrCode", userId],
    mutationFn: () => postQR({ token: ticketToken, size: 10 }),
  });

  const disableTicketMutation = useMutation({
    mutationKey: ["disableTicket", userId],
    mutationFn: () =>
      disableTicket({
        mobileNumber: userId,
      }),
    onSuccess: () => {
      setModalContent({
        content: `${seatNumber}번 좌석\n퇴실 처리가 완료되었습니다.`,
        submitText: "확인",
        submitAction: () => {
          clearUserId();
          setIsModalOpen(false);
        },
        isCloseIconVisible: false,
      });
    },
    onError: (error) => {
      console.error("이용권 비활성화 실패:", error);
    },
  });

  const handleBuyTicket = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!isPresent) {
      setModalContent({
        content: "이미 이용권이 있습니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: false,
      });
      setIsModalOpen(true);
      return;
    } else {
      navigate("/select-pass");
    }
  };

  const handleLogout = () => {
    if (!userId) {
      navigate("/login");
    }

    if (isUsing) {
      setModalContent({
        content: `${seatNumber}번 좌석\n퇴실하시겠습니까?`,
        submitText: "퇴실하기",
        submitAction: () => disableTicketMutation.mutate(),
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
    } else {
      setModalContent({
        content: "좌석 이용중이 아닙니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
    }
  };

  const handleCheckIn = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!isPresent) {
      setModalContent({
        content: "이용권이 없습니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
    } else if (isUsing) {
      setModalContent({
        content: "좌석을 이용중입니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
    } else if (!isUsing) {
      navigate("/select-seat");
    }
  };

  const handleChangeSeat = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (isUsing) {
      navigate("/changeseat");
    } else {
      setModalContent({
        content: "좌석을 이용중이 아닙니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
    }
  };

  const handleReissueTicket = () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    reissueTicketMutation.mutate();

    if (!!ticketToken) {
      qrMutation.mutate();
    } else if (!isUsing) {
      setModalContent({
        content: "좌석을 이용중이 아닙니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
    }
  };

  const {
    placeName,
    placeMobileNumber,
    totalSeat,
    remainSeat,
    expectCheckoutSeat,
  } = placeInfoData?.data || {};

  return (
    <>
      <Container>
        <DateInfo />
        {userId && <LogoutButton />}
        <ContentContainer>
          {/* 지점명/전화번호/로고 */}
          <HomeHeader
            placeName={placeName}
            placeMobileNumber={placeMobileNumber}
          />

          {/* 좌석 정보 */}
          <SeatInfo
            totalSeat={totalSeat}
            remainSeat={remainSeat}
            expectCheckoutSeat={expectCheckoutSeat}
          />

          {/* 메뉴 버튼 */}
          <HomeMenu
            handleBuyTicket={handleBuyTicket}
            handleLogout={handleLogout}
            handleCheckIn={handleCheckIn}
            handleChangeSeat={handleChangeSeat}
            handleReissueTicket={handleReissueTicket}
          />
        </ContentContainer>
        {/* 하단 배너 */}
        <FooterCarousel />
      </Container>

      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalContent={modalContent.content}
        submitText={modalContent.submitText}
        submitAction={modalContent.submitAction}
        isCloseIconVisible={modalContent.isCloseIconVisible}
      />
    </>
  );
};

export default HomePage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
  position: relative;
`;

const ContentContainer = styled.div`
  padding: 0 130px;
  margin-top: 120px;
`;
