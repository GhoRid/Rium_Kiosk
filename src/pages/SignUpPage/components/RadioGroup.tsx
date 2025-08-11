// components/RadioGroup.tsx
import styled from "styled-components";
import { colors } from "../../../colors";

type Option = { label: string; value: string };
type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
};

const RadioGroup = ({ value, onChange, options }: Props) => {
  return (
    <Wrap>
      {options.map((o) => (
        <Item key={o.value} onClick={() => onChange(o.value)}>
          <Circle data-checked={value === o.value} />
          <Txt>{o.label}</Txt>
        </Item>
      ))}
    </Wrap>
  );
};
export default RadioGroup;

const Wrap = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
`;

const Item = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Circle = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #cfd6dd;
  position: relative;
  &[data-checked="true"]::after {
    content: "";
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: ${colors.app_white};
  }
`;

const Txt = styled.span`
  font-size: 32px;
  color: #e8edf2;
`;
