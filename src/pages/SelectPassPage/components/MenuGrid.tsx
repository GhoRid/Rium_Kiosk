import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as ClockIcon } from "../../../assets/svgs/clock.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/svgs/calendar.svg";
import { ReactComponent as TimerIcon } from "../../../assets/svgs/timer.svg";
import { useNavigate } from "react-router";

const MenuGrid = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <OneButton>
        <Label>이용권 구매</Label>
        <IconBox>
          <ClockIcon />
        </IconBox>
      </OneButton>

      <TwoButtonRow>
        <TwoButton>
          <Label>기간권</Label>
          <IconBox>
            <CalendarIcon />
          </IconBox>
        </TwoButton>
        <TwoButton>
          <Label>시간권</Label>
          <IconBox>
            <TimerIcon />
          </IconBox>
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

const IconBox = styled.div`
  position: absolute;
  bottom: 30px;
  right: 40px;
`;

const BaseButton = styled.button`
  position: relative;
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
  padding: 60px 50px;
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
