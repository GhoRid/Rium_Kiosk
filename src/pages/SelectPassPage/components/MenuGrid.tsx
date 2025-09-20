import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as ClockIcon } from "../../../assets/svgs/clock.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/svgs/calendar.svg";
import { ReactComponent as TimerIcon } from "../../../assets/svgs/timer.svg";
import { ReactComponent as CouponIcon } from "../../../assets/svgs/coupon.svg";
import { useNavigate } from "react-router";

const MenuGrid = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <OneButton onClick={() => navigate("/singlepass")}>
        <Label>1회 이용권</Label>
        <IconBox>
          <ClockIcon />
        </IconBox>
      </OneButton>

      <TwoButtonRow>
        <TwoButton onClick={() => navigate("/periodpass")}>
          <Label>기간권</Label>
          <IconBox>
            <CalendarIcon />
          </IconBox>
        </TwoButton>
        <TwoButton onClick={() => navigate("/timepass")}>
          <Label>시간권</Label>
          <IconBox>
            <TimerIcon />
          </IconBox>
        </TwoButton>
      </TwoButtonRow>
      {/* <CouponButton
        onClick={() =>
          navigate("/usecoupon", {
            state: {
              from: "/selectpass",
            },
          })
        }
      >
        <Label>쿠폰 이용하기</Label>
        <Label>9월 모의고사 수험생 전용</Label>
        <IconBox>
          <CouponIcon />
        </IconBox>
      </CouponButton> */}
    </Container>
  );
};

export default MenuGrid;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.span`
  font-size: 40px;
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
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
`;

const TwoButtonRow = styled.div`
  display: flex;
  gap: 20px;
  /* margin-top: 20px; */
`;

const TwoButton = styled(BaseButton)`
  width: 350px;
  height: 330px;
  padding: 50px 0 0 40px;
  background: linear-gradient(180deg, #1c2e4a 0%, #112037 100%),
    ${colors.app_main_color};
`;

const CouponButton = styled(BaseButton)`
  width: 730px;
  height: 160px;
  display: flex;
  justify-content: center;
  padding: 0 40px;
  background: linear-gradient(180deg, #1c2e4a 0%, #112037 100%),
    ${colors.app_main_color};
`;
