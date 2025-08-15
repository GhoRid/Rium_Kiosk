import styled from "styled-components";
import DemoQr from "../../../components/completeForm/DemoQR";
import { colors } from "../../../colors";
import PassInfo from "../../../components/completeForm/PassInfo";

type CompleteCheckInFormProps = {
  date: string;
  selectedSeat: number;
};

const CompleteCheckInForm = ({
  date,
  selectedSeat,
}: CompleteCheckInFormProps) => {
  const InfoData = [
    { label: "입실 시간", value: date },
    { label: "좌석 번호", value: `${selectedSeat}번` },
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

export default CompleteCheckInForm;

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
