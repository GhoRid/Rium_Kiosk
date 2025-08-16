import styled, { keyframes } from "styled-components";
import { colors } from "../../../../colors";
import Card from "../../../../assets/images/CARD.png";

const CardAnimation = () => {
  return (
    <AnimationBox>
      <CardInlet />
      <Gradient />
      <Image src={Card} alt="카드 투입 애니메이션" />
    </AnimationBox>
  );
};

export default CardAnimation;

const AnimationBox = styled.div`
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
