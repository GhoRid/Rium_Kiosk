import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import { colors } from "../../colors";

const ResetPasswordPage = () => {
  return (
    <Container>
      <GoToHomeButton />
    </Container>
  );
};

export default ResetPasswordPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
`;
