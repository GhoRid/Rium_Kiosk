import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../assets/svgs/close.svg";
import { colors } from "../../../colors";
import CardAnimation from "./Animation/CardAnimation";
import BarCodeAnimation from "./Animation/BarCodeAnimation";
import SPayAnimation from "./Animation/SPayAnimation";

type PayAnimationModalProps = {
  paymentMethod: string | null;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  price: number;
};

const PayAnimationModal = ({
  paymentMethod,
  isModalOpen,
  setIsModalOpen,
  price,
}: PayAnimationModalProps) => {
  if (!isModalOpen) return null;
  let ment = "";

  if (paymentMethod === "카드") {
    ment = "카드를\n투입구에 넣어주세요";
  } else if (paymentMethod === "삼성페이") {
    ment = "삼성페이를 실행 후\n리더기에 가까이 대주세요.";
  } else if (paymentMethod === "간편결제") {
    ment = "바코드를 바코드 리더기에\n인식해 주세요.";
  }

  return (
    <ModalOverlay>
      <ModalContent>
        {/* <CLoseIconBox onClick={() => setIsModalOpen(false)}>
          <CloseIcon />
        </CLoseIconBox> */}

        <ContentBox>
          <ContentText>{ment}</ContentText>
        </ContentBox>
        {paymentMethod === "카드" && <CardAnimation />}
        {paymentMethod === "삼성페이" && <SPayAnimation />}
        {paymentMethod === "간편결제" && <BarCodeAnimation />}

        <PriceBox>
          <PriceText>결제 금액 ₩ {price.toLocaleString()}</PriceText>
        </PriceBox>
      </ModalContent>
    </ModalOverlay>
  );
};
export default PayAnimationModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors.app_white};
  border-radius: 30px;
  z-index: 1001;
  width: 760px;
  height: 800px;
  padding: 70px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 75px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ContentText = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: ${colors.app_black};
  text-align: center;
  white-space: pre-wrap;
`;

const CLoseIconBox = styled.button`
  position: absolute;
  top: 45px;
  right: 45px;
  cursor: pointer;
`;

const PriceBox = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PriceText = styled.span`
  font-size: 40px;
  color: ${colors.app_black};
  text-align: center;
`;
