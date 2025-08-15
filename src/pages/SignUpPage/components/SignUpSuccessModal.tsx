import styled from "styled-components";
import { colors } from "../../../colors";

type SignUpSuccessModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  submitAction: () => void;
};

const SignUpSuccessModal = ({
  isModalOpen,
  setIsModalOpen,
  submitAction = () => {},
}: SignUpSuccessModalProps) => {
  if (!isModalOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ContentBox>
          <ContentText>
            리움 님<br />
            회원 가입이 완료되었습니다.
          </ContentText>
        </ContentBox>

        <SubmitBox onClick={submitAction}>
          <SubmitText>로그인</SubmitText>
        </SubmitBox>
      </ModalContent>
    </ModalOverlay>
  );
};
export default SignUpSuccessModal;

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
  background-color: white;
  border-radius: 30px;
  z-index: 1001;
  width: 760px;
  min-height: 645px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 100px;
`;

const ContentText = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: ${colors.app_black};
  text-align: center;
  white-space: pre-wrap;
`;

const SubmitBox = styled.button`
  position: absolute;
  bottom: 60px;
  background-color: ${colors.app_main_color};
  width: 630px;
  height: 135px;
  border-radius: 30px;
`;

const SubmitText = styled.span`
  font-size: 40px;
  font-weight: bold;
  color: ${colors.app_white};
`;
