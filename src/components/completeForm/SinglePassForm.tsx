import styled from "styled-components";
import PassInfo from "./PassInfo";
import DemoQr from "./DemoQR";
import { colors } from "../../colors";

type PassType = "1회 이용권" | "자유석" | "고정석";

const SinglePassForm = () => {
  const InfoData = [
    {
      label: "입실 시간",
      value: "2025-08-24 17:25",
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

export default SinglePassForm;

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
