import styled, { keyframes } from "styled-components";
import { ReactComponent as CloseIcon } from "../../../assets/svgs/close.svg";
import { colors } from "../../../colors";
import Card from "../../../assets/images/CARD.png";

type CardModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  price: number;
};

const CardModal = ({ isModalOpen, setIsModalOpen, price }: CardModalProps) => {
  if (!isModalOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CLoseIconBox onClick={() => setIsModalOpen(false)}>
          <CloseIcon />
        </CLoseIconBox>

        <ContentBox>
          <ContentText>{"카드를\n투입구에 넣어주세요"}</ContentText>
        </ContentBox>

        <CardAnimationBox>
          <CardInlet />
          <Gradient />
          <Image src={Card} alt="카드 투입 애니메이션" />
        </CardAnimationBox>

        <PriceBox>
          <PriceText>결제 금액 ₩ {price.toLocaleString()}</PriceText>
        </PriceBox>
      </ModalContent>
    </ModalOverlay>
  );
};
export default CardModal;

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

const CardAnimationBox = styled.div`
  width: 390px;
  height: 350px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Gradient = styled.div`
  width: 350px;
  height: 60px;
  background: linear-gradient(
    to bottom,
    rgba(115, 115, 115, 1) 0%,
    rgba(255, 255, 255, 0.1) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  position: absolute;
  top: 0;
  z-index: 5;
`;

const CardInlet = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${colors.app_black};
  border-radius: 10px;
  position: absolute;
  top: 0;
  z-index: 1;
`;

const slideUpDown = keyframes`
  0% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-150px);
  }
  100% {
    transform: translateY(0);     
  }
`;

const slideUpInstantReset = keyframes`
  0% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-150px);
  }
  99.9% {
    transform: translateY(-150px);
  }
  100% {
    transform: translateY(0);     
  }
`;

const Image = styled.img`
  width: 350px;
  position: absolute;
  z-index: 2;
  animation: ${slideUpInstantReset} 4s ease-in-out infinite;
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
