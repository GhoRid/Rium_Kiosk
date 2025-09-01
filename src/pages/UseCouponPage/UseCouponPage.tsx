import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import CodeInput from "./components/CodeInput";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getCouponValid } from "../../apis/api/user";
import { usePriceStore } from "../../stores/usePriceStore";
import BottomButtons from "../../components/BottomButtons";
import CustomKeyboard from "../../components/CustomKeyboard";
import CustomModal from "../../components/CustomModal";
import { useNavigate } from "react-router";

const UseCouponPage = () => {
  const ticketId = usePriceStore((state) => state.ticketId);
  const setPrice = usePriceStore((state) => state.setPrice);
  const setUsingCouponCode = usePriceStore((state) => state.setUsingCouponCode);

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const getCouponValidMutation = useMutation({
    mutationKey: ["fetchUserData", couponCode],
    mutationFn: () => getCouponValid({ token: couponCode, ticketId }),
    onError: (error: any) => {
      if (error.response?.status === 477) {
        setModalContent("유효하지 않은 쿠폰입니다.");
      } else if (error.response?.status === 479) {
        setModalContent("해당 상품에는\n사용할 수 없는 쿠폰입니다.");
      } else if (error.response?.status === 480) {
        setModalContent("이미 사용된 쿠폰입니다.");
      } else {
        setModalContent("쿠폰을 사용할 수 없습니다.");
      }
      if (!isModalOpen) setIsModalOpen(true);
    },
    onSuccess: (data) => {
      const couponName = data.data.couponName;
      const discountedPrice = data.data.discountPrice;
      setPrice(discountedPrice);
      setUsingCouponCode(couponCode);
      setModalContent(`${couponName}\n쿠폰이 적용되었습니다`);
      setIsModalOpen(true);
    },
  });

  const { isError, isSuccess } = getCouponValidMutation;

  const handleModalAction = () => {
    if (isSuccess) {
      setIsModalOpen(false);
      navigate(-1);
    } else if (isError) {
      setIsModalOpen(false);
    }
  };

  const handleCouponCode = (v: string) => {
    const formatted = v.toUpperCase().slice(0, 6);
    setCouponCode(formatted);
  };

  const closeKeyboardOnBackground = () => setKeyboardVisible(false);

  const stop = (e: React.PointerEvent) => e.stopPropagation();

  return (
    <>
      <Container onPointerDown={closeKeyboardOnBackground}>
        <GoToHomeButton />
        <Header title="쿠폰 이용하기" />

        <Content>
          <Title>쿠폰 번호 입력</Title>

          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              setKeyboardVisible(true);
            }}
          >
            <CodeInput
              placeholder="쿠폰 번호(6자리)"
              value={couponCode}
              setValue={handleCouponCode}
            />
          </div>
        </Content>

        <BottomButtons
          submitName="확인"
          submit={() => getCouponValidMutation.mutate()}
        />

        {keyboardVisible && (
          <KeyboardWrap onPointerDown={stop}>
            <CustomKeyboard
              text={couponCode}
              setText={handleCouponCode}
              setKeyboardVisible={setKeyboardVisible}
              layoutNameProp="shift"
              allowedModes={["en", "num"]}
            />
          </KeyboardWrap>
        )}
      </Container>

      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalContent={modalContent}
        submitText="확인"
        submitAction={handleModalAction}
      />
    </>
  );
};

export default UseCouponPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  margin: 0 160px;
  padding-top: 350px;
  display: flex;
  flex-direction: column;
  gap: 100px;
  width: calc(100% - 320px);
`;

const Title = styled.h2`
  font-size: 50px;
  font-weight: 700;
  text-align: center;
`;

const KeyboardWrap = styled.div``;
