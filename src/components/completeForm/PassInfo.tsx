import styled from "styled-components";

type PassInfoProps = {
  InfoData: {
    label: string;
    value: string;
  }[];
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
  margin-top: 80px;
  margin-bottom: 100px;
  height: 100px;
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
