import styled, { keyframes } from "styled-components";

import BarCodeImage from "../../../../assets/images/BarCode.png";

const BarCodeAnimation = () => {
  return (
    <AnimationBox>
      <ContentBox>
        <Image src={BarCodeImage} alt="바코드 애니메이션" />
        <ScanOverlay />
      </ContentBox>
    </AnimationBox>
  );
};

export default BarCodeAnimation;

const AnimationBox = styled.div`
  width: 390px;
  height: 350px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentBox = styled.div`
  width: 400px;
  height: 100px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const scanGrow = keyframes`
  0%   { transform: scaleY(0); opacity: 0; }
  20%  { transform: scaleY(1); opacity: 0.65; }
  70%  { transform: scaleY(1); opacity: 0.65; }
  71%  { transform: scaleY(1); opacity: 0; }  
  100% { transform: scaleY(1); opacity: 0; }
`;

const ScanOverlay = styled.div`
  position: absolute;
  height: 100px;
  inset: 0;
  background: rgba(255, 0, 0, 0.4);
  animation: ${scanGrow} 4s ease-in-out infinite;
  z-index: 1;
`;
