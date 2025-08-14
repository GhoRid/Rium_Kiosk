import styled from "styled-components";
import PassInfo from "./PassInfo";
import DemoQr from "./DemoQR";

const ResultForm = () => {
  return (
    <Wrapper>
      {/* <PassInfo /> */}

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
