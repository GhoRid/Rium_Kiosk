import styled from "styled-components";
import { colors } from "../../../colors";
import { useState } from "react";
import { ReactComponent as DirectionDown } from "../../../assets/svgs/directionDown.svg";

const PaymentOptionSelector = () => {
  const [open, setOpen] = useState(false);

  const installmentOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <Wrapper>
      <OptionRow>
        <Option>
          <RadioButton />
          <Label>일시불</Label>
        </Option>
        <Option>
          <RadioButton />
          <Label>할부</Label>
          <InstallmentSelector>
            <InstallmentSelectorHeader onClick={() => setOpen((prev) => !prev)}>
              <InstallmentText>선택</InstallmentText>
              <DirectionDown width={30} />
            </InstallmentSelectorHeader>
            {open && (
              <OptionBody>
                {installmentOptions.map((option) => (
                  <InstallmentOption key={option}>
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
`;

const Label = styled.span`
  font-size: 40px;
`;

const InstallmentSelector = styled.div`
  position: relative;
  margin-left: 80px;
`;

const InstallmentSelectorHeader = styled.button`
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 60px;
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

const InstallmentOption = styled.div`
  padding: 10px 20px;
`;

const InstallmentOptionText = styled.span`
  font-size: 30px;
  color: ${colors.app_black};
`;
