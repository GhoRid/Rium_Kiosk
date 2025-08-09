import styled from "styled-components";

const SeatInfo = () => {
  return (
    <SeatInfoWrapper>
      <SeatInfoBox>
        <Label>잔여좌석</Label>
        <Value>
          24 <Small>/ 36</Small>
        </Value>
      </SeatInfoBox>
      <SeatInfoBox>
        <Label>퇴실 예정</Label>
        <Value>
          4 <Small>/ 36</Small>
        </Value>
      </SeatInfoBox>
    </SeatInfoWrapper>
  );
};

export default SeatInfo;

const SeatInfoWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 20px;
`;

const SeatInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 400px;
  height: 80px;
  padding: 30px;
  background-color: #000;
  border-radius: 30px;
`;

const Label = styled.div`
  font-size: 30px;
`;

const Value = styled.div`
  font-size: 40px;
  font-weight: bold;
`;

const Small = styled.span`
  font-size: 30px;
  color: #aaa;
`;
