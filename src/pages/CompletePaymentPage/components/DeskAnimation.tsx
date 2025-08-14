import styled, { keyframes } from "styled-components";
import { ReactComponent as DeskIconSvg } from "../../../assets/svgs/desk.svg";
import { ReactComponent as HandIconSvg } from "../../../assets/svgs/hand.svg";

const DeskAnimation = () => {
  return (
    <SvgWrapper>
      <InnerBox>
        <DeskIcon />
        <HandIcon />
      </InnerBox>
    </SvgWrapper>
  );
};

export default DeskAnimation;

const deskPulse = keyframes`
  0%   { transform: scale(1); }
  80%  { transform: scale(1.1); }
  80.1%, 100% { transform: scale(1); } 
`;

const handMove = keyframes`
  0%   { transform: translate(0, 0) rotate(0deg); }
  /* 20%  { transform: translate(0, 0) rotate(0deg); } */
  80%  { transform: translate(-55%, -65%) rotate(-8deg); }
  80.1%, 100% { transform: translate(0, 0) rotate(0deg); } 
`;

const SvgWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 680px;
  height: 600px;
`;

const InnerBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  pointer-events: none;
`;

const DeskIcon = styled(DeskIconSvg)`
  position: absolute;
  inset: 0;
  margin: auto;

  /* height: 100%; */
  transform-origin: center center;
  animation: ${deskPulse} 4s ease-in-out infinite;
  z-index: 1;
`;

const HandIcon = styled(HandIconSvg)`
  position: absolute;
  height: auto;
  right: -1%;
  bottom: -2%;
  transform-origin: center;
  animation: ${handMove} 4s ease-in-out infinite;
  z-index: 2;
`;
