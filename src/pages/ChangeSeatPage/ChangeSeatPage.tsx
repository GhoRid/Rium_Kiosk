import styled from "styled-components";
import GoToHomeButton from "../../components/GoToHomeButton";
import Header from "../../components/Header";
import { colors } from "../../colors";
import SeatMap from "../../components/seat/SeatMap";

const ChangeSeatPage = () => {
  return (
    <Container>
      <GoToHomeButton />
      <Header title="자리 이동" />
      <Content>
        <SeatMap
          selectedSeat={null} // 선택된 좌석이 없으므로 null
          onSelect={() => {}} // 선택 핸들러는 필요 없음
        />
      </Content>
    </Container>
  );
};

export default ChangeSeatPage;

const Container = styled.div`
  background-color: ${colors.app_black};
  color: ${colors.app_white};
  height: 1920px;
  position: relative;
`;

const Content = styled.div`
  padding-top: 280px;
  margin: 0 160px;
  width: calc(100% - 320px);
`;
