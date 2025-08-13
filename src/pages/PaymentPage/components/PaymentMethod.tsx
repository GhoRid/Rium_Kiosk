import styled from "styled-components";
import { colors } from "../../../colors";
import { ReactComponent as CardIcon } from "../../../assets/svgs/card.svg";
import { ReactComponent as SamsungPayIcon } from "../../../assets/svgs/samsungpay.svg";
import { ReactComponent as KakaoPayIcon } from "../../../assets/svgs/kakaopay.svg";
import { ReactComponent as PaycoIcon } from "../../../assets/svgs/payco.svg";

type PaymentMethodProps = {
  paymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
};

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodProps) => {
  const MethodList = [
    {
      name: "카드",
      icon: <CardIcon />,
    },
    {
      name: "삼성페이",
      icon: <SamsungPayIcon />,
    },
    {
      name: "간편결제",
      icon: (
        <IconBox>
          <KakaoPayIcon />
          <PaycoIcon />
        </IconBox>
      ),
    },
  ];

  return (
    <Wrapper>
      <Title>결제 수단 선택</Title>

      <MethodRow>
        {MethodList.map((method) => (
          <Element
            $isSelected={paymentMethod === method.name}
            key={method.name}
            onClick={() => setPaymentMethod(method.name)}
          >
            <Label>{method.name}</Label>
            {method.icon}
          </Element>
        ))}
      </MethodRow>
    </Wrapper>
  );
};

export default PaymentMethod;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 40px;
  width: 100%;
`;

const Title = styled.span`
  font-size: 40px;
  font-weight: 600;
`;

const MethodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Element = styled.button<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 240px;
  height: 200px;
  border-radius: 30px;
  border: ${(isSelected) =>
    isSelected ? "" : `1px solid ${colors.app_white}`};
  background-color: #2b2d30;
  color: ${colors.app_white};
  padding: 35px;
`;

const Label = styled.span`
  font-size: 30px;
  font-weight: 700;
`;

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;
