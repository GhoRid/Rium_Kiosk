import styled from "styled-components";
import { colors } from "../../../colors";

const MenuGrid = () => {
  return (
    <Container>
      <OneButton>
        <Label>이용권 구매</Label>
      </OneButton>

      <TwoButtonRow>
        <TwoButton>
          <Label>기간권</Label>
        </TwoButton>
        <TwoButton>
          <Label>시간권</Label>
        </TwoButton>
      </TwoButtonRow>
    </Container>
  );
};

export default MenuGrid;

const Container = styled.div`
  width: 100%;
`;

const Label = styled.span`
  font-size: 50px;
  font-weight: 500;
  line-height: 1.2;
  white-space: pre-line;
`;

const BaseButton = styled.button`
  border: none;
  border-radius: 30px;
  color: ${colors.app_white};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  text-align: left;

  &:hover {
    filter: brightness(1.05);
  }
`;

const OneButton = styled(BaseButton)`
  width: 730px;
  height: 300px;
  padding: 60px 0 0 50px;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
`;

const TwoButtonRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const TwoButton = styled(BaseButton)`
  width: 350px;
  height: 330px;
  padding: 50px 0 0 40px;
  background: linear-gradient(180deg, #1c2e4a 0%, #112037 100%),
    ${colors.app_main_color};
`;
