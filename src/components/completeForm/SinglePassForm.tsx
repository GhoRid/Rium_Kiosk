import styled from "styled-components";
import PassInfo from "./PassInfo";
import DemoQr from "./DemoQR";
import { colors } from "../../colors";

type SinglePassFormProps = {
  approvedAt: string;
  seatNumber: string;
};

const SinglePassForm = ({ approvedAt, seatNumber }: SinglePassFormProps) => {
  const InfoData = [
    {
      label: "입실 시간",
      value: approvedAt,
    },
    {
      label: "좌석 번호",
      value: `${seatNumber}번`,
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
