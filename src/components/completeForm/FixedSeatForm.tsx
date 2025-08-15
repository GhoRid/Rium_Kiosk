import styled from "styled-components";
import PassInfo from "./PassInfo";
import DemoQr from "./DemoQR";
import { colors } from "../../colors";

type PassType = "1회 이용권" | "자유석" | "고정석";

const FixedSeatForm = () => {
  const InfoData = [
    {
      label: "상품명",
      value: "기간권 4주 고정석",
    },
    {
      label: "좌석 번호",
      value: "12번",
    },
  ];

  return (
    <Wrapper>
      <PassInfo InfoData={InfoData} />

      <DemoQr />

      <GuidTextBox>
        <GuidText>
          문자로 전송된 QR코드를
          <br />
          스캔 후 입장해주세요.
        </GuidText>
      </GuidTextBox>
    </Wrapper>
  );
};

export default FixedSeatForm;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
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
