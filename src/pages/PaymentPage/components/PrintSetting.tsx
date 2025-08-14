import styled from "styled-components";
import { colors } from "../../../colors";

type PrintSettingProps = {
  printReceipt: boolean;
  setPrintReceipt: (value: boolean) => void;
  printPass: boolean;
  setPrintPass: (value: boolean) => void;
};

const PrintSetting = ({
  printReceipt,
  setPrintReceipt,
  printPass,
  setPrintPass,
}: PrintSettingProps) => {
  return (
    <Wrapper>
      <Title>인쇄 설정</Title>

      <OptionRow>
        <Option>
          <RadioButton
            onClick={() => setPrintReceipt(!printReceipt)}
            aria-label="영수증 출력 설정"
          >
            <RadioButtonIsOn $isSelected={printReceipt} />
          </RadioButton>
          <OptionLabel>영수증 출력</OptionLabel>
        </Option>

        <Option>
          <RadioButton
            onClick={() => setPrintPass(!printPass)}
            aria-label="출입증 출력 설정"
          >
            <RadioButtonIsOn $isSelected={printPass} />
          </RadioButton>
          <OptionLabel>출입증 출력</OptionLabel>
        </Option>
      </OptionRow>
    </Wrapper>
  );
};
export default PrintSetting;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 50px;
  gap: 20px;
  border-top: 1px solid ${colors.app_white};
  margin-top: 50px;
`;

const Title = styled.span`
  font-size: 40px;
  font-weight: 600;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 10px;
  background-color: transparent;
  border: none;
`;

const OptionLabel = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
`;

const RadioButton = styled.button`
  width: 40px;
  aspect-ratio: 1;
  border: 2px solid ${colors.app_white};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RadioButtonIsOn = styled.div<{ $isSelected: boolean }>`
  width: 22px;
  aspect-ratio: 1;
  background-color: ${colors.app_white};
  display: ${({ $isSelected }) => ($isSelected ? "block" : "none")};
`;
