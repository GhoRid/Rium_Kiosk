import styled from "styled-components";
import { colors } from "../../colors";
import PassInfo from "./PassInfo";
import DeskAnimation from "./DeskAnimation";

type FreeSeatFormProps = {
  passType: string;
  label: string;
};

const FreeSeatForm = ({ passType, label }: FreeSeatFormProps) => {
  const InfoData = [
    {
      label: "상품명",
      value: `${passType} ${label}`,
    },
  ];

  return (
    <Wrapper>
      <PassInfo InfoData={InfoData} />

      <DeskAnimation />

      <GuidTextBox>
        <GuidText>입실하기 → 좌석선택 후 입장해주세요.</GuidText>
      </GuidTextBox>
    </Wrapper>
  );
};

export default FreeSeatForm;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const GuidTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const GuidText = styled.span`
  font-size: 50px;
  font-weight: 700;
  color: ${colors.app_white};
  text-align: center;
`;
