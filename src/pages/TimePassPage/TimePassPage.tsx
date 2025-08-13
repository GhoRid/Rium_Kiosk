import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";

const TimePassPage = () => {
  return (
    <Container>
      <Header title="시간권" />
    </Container>
  );
};

export default TimePassPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;
