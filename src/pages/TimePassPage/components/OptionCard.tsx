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
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border: ${({ $isSelected }) =>
    $isSelected ? `2px solid ${colors.app_white}` : "none"};

  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
`;

const Label = styled.span`
  font-size: 36px;
  font-weight: 700;
`;

const Price = styled.span`
  font-size: 30px;

  margin-top: 25px;
`;
