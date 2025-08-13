import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";

const PeriodPassPage = () => {
  return (
    <Container>
      <Header title="기간권" />
    </Container>
  );
};

export default PeriodPassPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;
