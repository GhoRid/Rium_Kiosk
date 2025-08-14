import styled from "styled-components";
import { colors } from "../../../colors";

type PassInfoProps = {
  InfoData: {
    label: string;
    value: string;
  }[];
  // label: string;
  // price: number;
};

const PassInfo = ({ InfoData }: PassInfoProps) => {
  return (
    <Wrapper>
      {InfoData.map((info, index) => (
        <InfoRow key={index}>
          <Label>{info.label}</Label>
          <Devider>|</Devider>
          <Value>{info.value}</Value>
        </InfoRow>
      ))}
    </Wrapper>
  );
};

export default PassInfo;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  width: 80%;
  margin-top: 80px;
  margin-bottom: 130px;
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
