import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../assets/svgs/close.svg";
import { colors } from "../colors";

type CustomModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  modalContent: string;
  submitText: string;
  submitAction: () => void;
  isCloseIconVisible?: boolean;
};

const CustomModal = ({
  isModalOpen,
  setIsModalOpen,
  modalContent,
  submitText = "닫기",
  submitAction = () => {},
  isCloseIconVisible = true,
}: CustomModalProps) => {
  if (!isModalOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        {isCloseIconVisible && (
          <CLoseIconBox onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </CLoseIconBox>
        )}

        <ContentBox>
          <ContentText>{modalContent}</ContentText>
        </ContentBox>

        <SubmitBox onClick={submitAction}>
          <SubmitText>{submitText}</SubmitText>
        </SubmitBox>
      </ModalContent>
    </ModalOverlay>
  );
};
export default CustomModal;

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

const CLoseIconBox = styled.button`
  position: absolute;
  top: 45px;
  right: 45px;
  cursor: pointer;
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
