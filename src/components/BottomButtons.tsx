import styled from "styled-components";
import { colors } from "../colors";
import { useNavigate } from "react-router";

type BottomButtonsProps = {
  submitName: string;
  submit?: () => void;
};

const BottomButtons = ({ submitName, submit }: BottomButtonsProps) => {
  const navigate = useNavigate();

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <Text>이전</Text>
      </BackButton>

      <SingUpButton onClick={submit}>
        <Text>{submitName}</Text>
      </SingUpButton>
    </Container>
  );
};

export default BottomButtons;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 135px;
  width: 100%;
  gap: 20px;
  margin-top: 200px;
`;

const Text = styled.p`
  color: ${colors.app_white};
  font-size: 40px;
  font-weight: 700;
`;

const BackButton = styled.button`
  width: 280px;
  height: 100%;
  border-radius: 30px;
  border: 1px solid ${colors.app_white};
`;

const SingUpButton = styled.button`
  width: 460px;
  height: 100%;
  border-radius: 30px;
  background-color: ${colors.app_main_color};
`;
