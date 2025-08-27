import styled from "styled-components";
import HomeMenu from "./components/HomeMenu";
import { colors } from "../../colors";
import SeatInfo from "./components/SeatInfo";
import HeaderInfoBox from "./components/HeaderInfoBox";
import HomeHeader from "./components/HomeHeader";
import FooterCarousel from "./components/FooterCarousel";
import CustomModal from "../../components/CustomModal";
import { useEffect, useState } from "react";
import { useUserId } from "../../hooks/useUserId";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlaceInformation } from "../../apis/api/kioskAuth";
import { disableTicket, getUserData } from "../../apis/api/user";
import { clearUserId } from "../../utils/tokens";
import { useNavigate } from "react-router";
import { reissueTicket } from "../../apis/api/pass";
import { postQR } from "../../apis/api/receipt";
import { useTicketStore } from "../../stores/useTicketStore";

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
  const setUserHasTicket = useTicketStore((state) => state.setHasTicket);

  const { data: placeInfoData } = useQuery({
    queryKey: ["placeInformation"],
    queryFn: () => getPlaceInformation(),
  });

  const { data: userData, isSuccess: getUserDataIsSuccess } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserData({ mobileNumber: userId }),
    enabled: !!userId,
  });

  const {
    canExit,
    ticketName,
    name,
    using: isUsing,
    seatNumber,
    ticket: isTicketPresent,
  } = userData?.data || {};

  useEffect(() => {
    if (getUserDataIsSuccess) {
      setUserHasTicket(!!isTicketPresent);
    }
  }, [getUserDataIsSuccess]);

  const reissueTicketMutation = useMutation({
    mutationKey: ["reissueTicket", userId],
    mutationFn: () => reissueTicket({ mobileNumber: userId }),
    // 499 -> 티켓 없음
  });

  const qrMutation = useMutation({
    mutationKey: ["qrCode", userId],
    mutationFn: () => postQR({ token: ticketToken, size: 10 }),
  });

  const ticketToken = reissueTicketMutation?.data?.data || "";

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

    if (isTicketPresent) {
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
      return;
    }
  };

  const handlecheckextendpass = () => {
    navigate("/checkextendpass");
    return;
  };

  const handleChangeSeat = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!isTicketPresent) {
      setModalContent({
        content: "이용권이 없습니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
      return;
    } else if (isUsing) {
      navigate("/changeseat");
      return;
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
      return;
    }
  };

  const handleLogout = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!isTicketPresent) {
      setModalContent({
        content: `이용권이 없습니다.`,
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
      return;
    } else if (!canExit) {
      setModalContent({
        content: `${ticketName}은 퇴실할 수 없습니다.`,
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
      return;
    } else if (isUsing) {
      setModalContent({
        content: `${seatNumber}번 좌석\n퇴실하시겠습니까?`,
        submitText: "퇴실하기",
        submitAction: () => disableTicketMutation.mutate(),
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
      return;
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
      return;
    }
  };

  const handleCheckIn = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!isTicketPresent) {
      setModalContent({
        content: "이용권이 없습니다.",
        submitText: "확인",
        submitAction: () => {
          setIsModalOpen(false);
        },
        isCloseIconVisible: true,
      });
      setIsModalOpen(true);
      return;
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
      return;
    } else if (!isUsing) {
      navigate("/select-seat");
      return;
    }
  };

  const handleReissueTicket = () => {
    if (!userId) {
      navigate("/login");
      return;
    } else {
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
        return;
      }
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
        <HeaderInfoBox userName={name} />
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
            handlecheckextendpass={handlecheckextendpass}
            handleChangeSeat={handleChangeSeat}
            handleLogout={handleLogout}
            handleCheckIn={handleCheckIn}
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
  align-items: center;
  height: 1920px;
  width: 100%;
  position: relative;
`;

const ContentContainer = styled.div`
  padding: 0 130px;
  margin-top: 150px;
`;
