import styled from "styled-components";
import { useNavigate } from "react-router";
import { colors } from "../../../colors";
import { clearUserId } from "../../../utils/tokens";

type BottomButtonProps = {
  submitName: string;
  submit: () => void;
};

const BottomButton = ({ submitName = "확인", submit }: BottomButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUserId();
    navigate("/home");
  };

  return (
    <Container>
      <BackButton onClick={() => handleLogout()}>
        <Text>로그아웃</Text>
      </BackButton>

      <SubmitButton onClick={submit}>
        <Text>{submitName}</Text>
      </SubmitButton>
    </Container>
  );
};

export default BottomButton;

const Container = styled.div`
  position: absolute;
  bottom: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 135px;
  width: 100%;
  gap: 20px;
`;

const Text = styled.p`
  color: ${colors.app_white};
  font-size: 40px;
  font-weight: 700;
`;

const BackButton = styled.button`
  width: 370px;
  height: 100%;
  border-radius: 30px;
  border: 1px solid ${colors.app_white};
`;

const SubmitButton = styled.button`
  width: 370px;
  height: 100%;
  border-radius: 30px;
  background-color: ${colors.app_main_color};
`;
