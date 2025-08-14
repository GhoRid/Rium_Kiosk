import styled from "styled-components";
import PassInfo from "./PassInfo";
import DemoQr from "./DemoQR";

type PassType = "일반" | "고정석" | "VIP";

type ResultFormProps = {
  passtype: string;
};

const ResultForm = ({ passtype }: ResultFormProps) => {
  return (
    <Wrapper>
      <DemoQr />
    </Wrapper>
  );
};

export default ResultForm;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;
