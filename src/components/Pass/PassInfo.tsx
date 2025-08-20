import styled from "styled-components";
import { colors } from "../../colors";
import { formatIsoToTwoLinesRaw } from "../../utils/formatDate";

type PassInfoProps = {
  expirationDate?: string;
  remainTime: string; // 예: "2시간 30분"
  seatNumber: string; // 예: "12"
  ticketName: string; // 예: "4주 자유석" (없으면 빈 상태로 간주)
  ticketType: string; // 예: "기간권"
  isUsing: boolean;
};

const PassInfo = ({
  expirationDate,
  remainTime,
  seatNumber,
  ticketName,
  ticketType,
  isUsing,
}: PassInfoProps) => {
  const hasTicket = ticketName !== "이용권 없음";

  return (
    <Wrapper>
      <Title>이용권 정보</Title>

      <PassBox>
        {hasTicket ? (
          <>
            <PassTextBox>
              <PassHeader>
                <PassName>{ticketName}</PassName>
                {expirationDate && (
                  <PassPeriod>
                    {formatIsoToTwoLinesRaw(expirationDate)} 까지
                  </PassPeriod>
                )}
              </PassHeader>
              <PassContent>
                {seatNumber ? `${seatNumber} 번 좌석` : "미 이용중"}
              </PassContent>
              <PassContent>{remainTime} 남음</PassContent>
            </PassTextBox>

            {isUsing && (
              <Button
                onClick={() => {
                  console.log("이용권 연장하기 클릭");
                }}
              >
                연장하기
              </Button>
            )}
          </>
        ) : (
          <BoxCenter>
            <BoxText>구매하신 이용권이 없습니다.</BoxText>
          </BoxCenter>
        )}
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
  min-height: 275px;
`;

const PassTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 50px 70px 0 70px;
`;

const PassHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 15px;
`;

const PassName = styled.span`
  font-size: 36px;
  font-weight: 700;
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
  margin: 40px 0 50px;
`;

const BoxCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 275px;
  width: 100%;
`;

const BoxText = styled.span`
  font-size: 36px;
  font-weight: 700;
  color: ${colors.app_white};
  text-align: center;
`;
