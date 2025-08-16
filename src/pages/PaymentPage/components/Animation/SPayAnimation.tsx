import styled, { keyframes } from "styled-components";
import SPay from "../../../../assets/images/SPay.png";

const SPayAnimation = () => {
  return (
    <AnimationBox>
      <Image src={SPay} alt="삼성페이 애니메이션" />
      <Ripple />
      <Ripple delay="0.6s" />
      <Ripple delay="1.2s" />
    </AnimationBox>
  );
};

export default SPayAnimation;

const AnimationBox = styled.div`
  width: 500px;
  height: 350px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Image = styled.img`
  width: 350px;
  position: absolute;
  z-index: 2;
`;

const ripple = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0.6;
  }
  100% {
    transform: scale(3.5);
    opacity: 0;
  }
`;

const Ripple = styled.div<{ delay?: string }>`
  position: absolute;
  bottom: 90px;
  right: 70px;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgba(0, 174, 255, 0.8);
  animation: ${ripple} 2.5s linear infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  z-index: 10;
`;
