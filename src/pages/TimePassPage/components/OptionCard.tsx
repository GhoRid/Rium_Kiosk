import styled from "styled-components";
import { colors } from "../../../colors";

type OptionCardProps = {
  label: string;
  price: number;
  width: number;
  height: number;
  selectedOption: string | null;
  selectOption: (option: string | null) => void;
};

const OptionCard = ({
  label,
  price,
  width: WIDTH,
  height: HEIGHT,
  selectedOption,
  selectOption,
}: OptionCardProps) => {
  return (
    <Card
      $isSelected={selectedOption === label}
      $width={WIDTH}
      $height={HEIGHT}
      onClick={() => {
        if (selectedOption === label) {
          selectOption(null);
        } else {
          selectOption(label);
        }
      }}
    >
      <Label>{label}</Label>
      <Price>₩ {price.toLocaleString()}</Price>
    </Card>
  );
};

export default OptionCard;

const BaseButton = styled.button`
  position: relative;
  border: none;
  border-radius: 30px;
  color: ${colors.app_white};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Card = styled(BaseButton)<{
  $isSelected: boolean;
  $width: number;
  $height: number;
}>`
  width: ${({ $width }) => (Number.isFinite($width) ? $width : 320)}px;
  height: ${({ $height }) => (Number.isFinite($height) ? $height : 160)}px;
  padding: 24px;
  border: ${({ $isSelected }) =>
    $isSelected ? `2px solid ${colors.app_white}` : ""};
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
`;
const Label = styled.span`
  /* 또는 && { ... } */
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
`;
const Price = styled.span`
  font-size: 30px;
  margin-top: 25px;
  line-height: 1.2;
  text-align: center;
`;
