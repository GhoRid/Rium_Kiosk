import styled from "styled-components";
import { colors } from "../../colors";
import PassInfo from "./PassInfo";
import DeskAnimation from "./DeskAnimation";

type PassType = "1회 이용권" | "자유석" | "고정석";

const FreeSeatForm = () => {
  const InfoData = [
    {
      label: "상품명",
      value: "시간권 50시간",
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
  margin-top: 130px;
`;

const GuidText = styled.span`
  font-size: 40px;
  font-weight: 700;
  color: ${colors.app_white};
  text-align: center;
`;
