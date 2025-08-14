import styled from "styled-components";
import { colors } from "../../../colors";

type Props = {
  onPress: (val: string) => void;
};

const NumberKeypad = ({ onPress }: Props) => {
  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "지움",
    "0",
    "010",
  ];
  return (
    <Keypad>
      {keys.map((k) => (
        <Key key={k} onClick={() => onPress(k)} data-dim={k === "지움"}>
          {k}
        </Key>
      ))}
    </Keypad>
  );
};

export default NumberKeypad;

const Keypad = styled.div`
  width: 495px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const Key = styled.button<{ "data-dim"?: boolean }>`
  height: 120px;
  border-radius: 30px;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.01) 0%,
      rgba(255, 255, 255, 0) 100%
    ),
    #2b2b2b;
  color: ${colors.app_white};
  font-size: 40px;
  ${({ "data-dim": dim }) => dim && `color: #cfd6dd;`}
  &:active {
    transform: translateY(1px);
  }
`;
