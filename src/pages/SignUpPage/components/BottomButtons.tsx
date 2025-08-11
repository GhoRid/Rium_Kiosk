import styled from "styled-components";
import { colors } from "../../../colors";

const BottomButtons = () => {
  return (
    <Container>
      <BackButton>
        <Text>이전</Text>
      </BackButton>

      <SingUpButton>
        <Text>회원가입</Text>
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
