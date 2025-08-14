import styled from "styled-components";
import { colors } from "../../../colors";

type PassInfoProps = {
  passType: string;
  label: string;
  price: number;
};

const PassInfo = ({ passType, label, price }: PassInfoProps) => {
  return (
    <Wrapper>
      <InfoRow>
        <Label>입실 시간</Label>
        <Devider>|</Devider>
        <Value>
          {passType} {label}
        </Value>
      </InfoRow>
      <InfoRow>
        <Label>좌석 번호</Label>
        <Devider>|</Devider>
        <Value>₩ {price.toLocaleString()}</Value>
      </InfoRow>
    </Wrapper>
  );
};

export default PassInfo;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
  height: 225px;
  width: 100%;
  border-top: 1px solid ${colors.app_white};
  border-bottom: 1px solid ${colors.app_white};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Label = styled.span`
  font-size: 40px;
  font-weight: 600;
  min-width: 150px;
`;

const Value = styled.span`
  font-size: 40px;
`;

const Devider = styled.span`
  font-size: 40px;
`;
