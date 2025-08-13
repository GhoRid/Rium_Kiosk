import styled from "styled-components";
import { colors } from "../../../colors";
import { useState } from "react";
import { ReactComponent as DirectionDown } from "../../../assets/svgs/directionDown.svg";

type PaymentOptionSelectorProps = {
  installment: string;
  setInstallment: (v: string) => void;
  selectedInstallmentOption: number | null;
  setSelectedInstallmentOption: (v: number | null) => void;
};

const PaymentOptionSelector = ({
  installment,
  setInstallment,
  selectedInstallmentOption,
  setSelectedInstallmentOption,
}: PaymentOptionSelectorProps) => {
  const [open, setOpen] = useState(false);

  const installmentOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <Wrapper>
      <OptionRow>
        <Option
          onClick={() => {
            setInstallment("일시불");
            setOpen(false);
          }}
        >
          <RadioButton>
            <RadioButtonIsOn $isSelected={installment === "일시불"} />
          </RadioButton>
          <Label>일시불</Label>
        </Option>
        <Option
          onClick={() => {
            setInstallment("할부");
          }}
        >
          <RadioButton>
            <RadioButtonIsOn $isSelected={installment === "할부"} />
          </RadioButton>
          <Label>할부</Label>
          <InstallmentSelector>
            <InstallmentSelectorHeader onClick={() => setOpen((prev) => !prev)}>
              <InstallmentText>
                {selectedInstallmentOption
                  ? `${selectedInstallmentOption}개월`
                  : "선택"}
              </InstallmentText>
              <DirectionDown width={30} />
            </InstallmentSelectorHeader>
            {open && (
              <OptionBody>
                {installmentOptions.map((option) => (
                  <InstallmentOption
                    key={option}
                    onClick={() => {
                      setSelectedInstallmentOption(option);
                      setOpen(false);
                    }}
                  >
                    <InstallmentOptionText>{option}개월</InstallmentOptionText>
                  </InstallmentOption>
                ))}
              </OptionBody>
            )}
          </InstallmentSelector>
        </Option>
      </OptionRow>
    </Wrapper>
  );
};

export default PaymentOptionSelector;

const Wrapper = styled.div`
  margin-top: 65px;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 120px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const RadioButton = styled.button`
  width: 45px;
  aspect-ratio: 1;
  border: 1px solid ${colors.app_white};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RadioButtonIsOn = styled.div<{ $isSelected: boolean }>`
  width: 25px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${colors.app_white};
  display: ${({ $isSelected }) => ($isSelected ? "block" : "none")};
`;

const Label = styled.span`
  font-size: 40px;
`;

const InstallmentSelector = styled.div`
  position: relative;
  margin-left: 80px;
`;

const InstallmentSelectorHeader = styled.button`
  width: 180px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${colors.app_white};
`;

const InstallmentText = styled.span`
  font-size: 30px;
  color: ${colors.app_white};
`;

const OptionBody = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${colors.app_white};
  width: 100%;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
    display: block;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${colors.app_black};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const InstallmentOption = styled.button`
  padding: 10px 20px;
`;

const InstallmentOptionText = styled.span`
  font-size: 30px;
  color: ${colors.app_black};
`;
