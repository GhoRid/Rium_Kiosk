import styled from "styled-components";
import { colors } from "../../colors";

const PassInfo = () => {
  return (
    <Wrapper>
      <Title>이용권 정보</Title>

      <PassBox>
        <PassTextBox>
          <PassHeader>
            <PassName>1회 이용권</PassName>
            <PassPeriod>2023.10.01 ~ 2023.10.31</PassPeriod>
          </PassHeader>
          <PassContent>12번 좌석</PassContent>
          <PassContent>2시간 30분 남음</PassContent>
        </PassTextBox>
        <Button>연장하기</Button>
      </PassBox>
    </Wrapper>
  );
};

export default PassInfo;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 90px;
`;

const Title = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: ${colors.app_white};
`;

const PassBox = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
  padding: 50px 0 40px 0;
`;

const PassTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 70px;
  margin-bottom: 40px;
`;

const PassHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 15px;
`;

const PassName = styled.span`
  font-size: 36px;
  color: ${colors.app_white};
`;

const PassPeriod = styled.span`
  font-size: 28px;
  color: #bcbcbc;
`;

const PassContent = styled.span`
  font-size: 32px;
  color: ${colors.app_white};
`;

const Button = styled.button`
  align-self: center;
  width: 720px;
  height: 100px;
  border-radius: 30px;
  background-color: ${colors.app_main_color};
  color: ${colors.app_white};
  font-size: 30px;
  font-weight: bold;
`;
