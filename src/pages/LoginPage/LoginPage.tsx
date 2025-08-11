import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";

const LoginPage = () => {
  return (
    <Container>
      <GoToHomeButton />
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  background-color: ${colors.app_background};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
  /* padding: 0 130px; */
  /* margin-top: 200px; */
`;
