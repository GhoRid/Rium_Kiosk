import styled, { keyframes } from "styled-components";
import { ReactComponent as DemoQrSvg } from "../../../assets/svgs/demoQR.svg";
import { colors } from "../../colors";

const DemoQr = () => {
  return (
    <SvgWrapper>
      <DemoQrSvg />

      <InnerBox>
        <ScanOverlay />
        <CenterLine />
      </InnerBox>
    </SvgWrapper>
  );
};

export default DemoQr;

const SvgWrapper = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
  svg {
    display: block;
  }
`;

const InnerBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 320px;
  transform: translate(-50%, -50%);
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

const CenterLine = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 320px;
  height: 5px;
  background-color: ${colors.red};
  transform: translateY(-50%);
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
  inset: 0;
  background: rgba(255, 0, 0, 0.4);
  transform-origin: 50% 50%;
  transform: scaleY(0);
  animation: ${scanGrow} 4s ease-in-out infinite;
  z-index: 1;
`;
