import styled from "styled-components";
import { colors } from "../../colors";
import PassInfo from "./PassInfo";
import DeskAnimation from "./DeskAnimation";

type ExtendFormProps = {
  passType: string;
  label: string;
};

const ExtendForm = ({ passType, label }: ExtendFormProps) => {
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
        <GuidText>이용권이 연장되었습니다.</GuidText>
      </GuidTextBox>
    </Wrapper>
  );
};

export default ExtendForm;

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
