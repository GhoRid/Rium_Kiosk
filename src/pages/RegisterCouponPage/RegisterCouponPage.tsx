import styled from "styled-components";
import { colors } from "../../colors";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";

const RegisterCouponPage = () => {
  return (
    <Container>
      <GoToHomeButton />
      <Header title="구폰 등록하기" />
    </Container>
  );
};

export default RegisterCouponPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  display: flex;
  flex-direction: column;
  height: 1920px;
  position: relative;
`;
