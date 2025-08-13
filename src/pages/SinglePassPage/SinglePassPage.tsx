import styled from "styled-components";
import { colors } from "../../colors";
import Header from "../../components/Header";

const SinglePassPage = () => {
  return (
    <Container>
      <Header title="1회 이용권" />
    </Container>
  );
};

export default SinglePassPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;
